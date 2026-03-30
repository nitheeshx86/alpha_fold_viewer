import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneInfo } from "@/data/genes";
import { getAlphaFoldUrls } from "@/data/genes";
import type { Mutation } from "@/data/mutations";

interface ProteinViewerProps {
  gene: GeneInfo;
  mutations: Mutation[];
  showMutations: boolean;
}

const ProteinViewer = ({ gene, mutations, showMutations }: ProteinViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const mutationRepsRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMutation, setHoveredMutation] = useState<Mutation | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const loadStructure = useCallback(async () => {
    if (!containerRef.current) return;

    setLoading(true);
    setError(null);
    setHoveredMutation(null);
    mutationRepsRef.current = [];

    if (stageRef.current) {
      stageRef.current.dispose();
      stageRef.current = null;
    }

    try {
      const NGL = await import("ngl");

      const stage = new NGL.Stage(containerRef.current, {
        backgroundColor: "rgb(15, 20, 25)",
        quality: "high",
        impostor: true,
        clipDist: 0,
      });
      stageRef.current = stage;

      const urls = getAlphaFoldUrls(gene.uniprotId);
      let component: any = null;
      let lastError: unknown = null;

      for (const url of urls) {
        try {
          const ext = url.endsWith(".cif") ? "cif" : "pdb";
          component = (await stage.loadFile(url, { ext })) as any;
          if (component) break;
        } catch (candidateError) {
          lastError = candidateError;
        }
      }

      if (!component) {
        throw lastError ?? new Error("No AlphaFold structure could be loaded.");
      }

      component.addRepresentation("cartoon", {
        colorScheme: "bfactor",
        colorScale: ["#ef4444", "#f59e0b", "#3b82f6"],
        colorDomain: [50, 70, 90],
        opacity: 0.95,
      });

      if (mutations.length > 0) {
        const sele = mutations.map((m) => `${m.position}`).join(" or ");
        const rep = component.addRepresentation("spacefill", {
          sele,
          color: "#f43f5e",
          opacity: 0.95,
          scale: 1.6,
          visible: showMutations,
        });
        mutationRepsRef.current.push(rep);
      }

      component.autoView();
      stage.setSpin(false);

      stage.signals.hovered.removeAll();
      stage.signals.hovered.add((pickingProxy: any) => {
        if (!pickingProxy?.atom) {
          setHoveredMutation(null);
          return;
        }

        const resno = pickingProxy.atom.resno;
        const found = mutations.find((m) => m.position === resno);
        if (!found) {
          setHoveredMutation(null);
          return;
        }

        const mouse = pickingProxy.mouse?.position;
        setHoveredMutation(found);
        setTooltipPos({
          x: mouse?.x ?? 0,
          y: mouse?.y ?? 0,
        });
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to load structure:", err);
      setError("Failed to load AlphaFold structure for this gene.");
      setLoading(false);
    }
  }, [gene.uniprotId, mutations]);

  useEffect(() => {
    loadStructure();
    return () => {
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
      }
    };
  }, [loadStructure]);

  useEffect(() => {
    mutationRepsRef.current.forEach((rep) => {
      rep.setVisibility(showMutations);
    });
  }, [showMutations]);

  useEffect(() => {
    const handleResize = () => stageRef.current?.handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-lg border border-border">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-sm text-muted-foreground">
            Loading AlphaFold structure for {gene.symbol}...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
          <p className="mb-2 text-sm text-destructive">{error}</p>
          <button
            onClick={loadStructure}
            className="rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      <div ref={containerRef} className="h-full min-h-[500px] w-full" />

      {hoveredMutation && showMutations && (
        <div
          className="pointer-events-none absolute z-20 rounded-md border border-primary/30 bg-card px-3 py-2"
          style={{ left: tooltipPos.x + 15, top: tooltipPos.y - 10 }}
        >
          <p className="font-mono text-sm font-semibold text-primary">{hoveredMutation.label}</p>
          <p className="text-xs text-muted-foreground">Position: {hoveredMutation.position}</p>
          <p className="text-xs text-muted-foreground">
            {hoveredMutation.wildType} → {hoveredMutation.mutant}
          </p>
          <p className="text-xs text-foreground">{hoveredMutation.cancerType}</p>
        </div>
      )}
    </div>
  );
};

export default ProteinViewer;
