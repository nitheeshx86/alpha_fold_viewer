const InfoPanel = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          pLDDT Confidence
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          AlphaFold provides per-residue confidence scores (pLDDT) ranging from 0–100.
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-confidence-high" />
            <span className="text-xs text-foreground">High confidence (&gt;90)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-confidence-medium" />
            <span className="text-xs text-foreground">Medium (70–90)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-confidence-low" />
            <span className="text-xs text-foreground">Low (&lt;70)</span>
          </div>
        </div>
      </div>



      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Mutation Markers
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-mutation-marker" />
          <span className="text-xs text-foreground">Cancer hotspot mutations</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mutations from cBioPortal are mapped to their residue positions on the 3D structure.
          Hover over markers for details.
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
