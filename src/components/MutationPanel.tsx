import type { Mutation } from "@/data/mutations";

interface MutationPanelProps {
  mutations: Mutation[];
  showMutations: boolean;
  onToggle: () => void;
}

const MutationPanel = ({ mutations, showMutations, onToggle }: MutationPanelProps) => {
  const significanceColor = (sig: Mutation["significance"]) => {
    switch (sig) {
      case "pathogenic": return "bg-destructive/20 text-destructive";
      case "likely_pathogenic": return "bg-confidence-medium/20 text-confidence-medium";
      case "vus": return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Mutations ({mutations.length})
        </h3>
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
            showMutations
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {showMutations ? "Visible" : "Hidden"}
        </button>
      </div>

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {mutations.map((mut) => (
          <div
            key={mut.label}
            className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/50 border border-border/50 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mutation-marker" />
              <span className="font-mono text-sm font-medium text-foreground">
                {mut.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                {mut.frequency}%
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${significanceColor(mut.significance)}`}
              >
                {mut.significance === "likely_pathogenic" ? "LP" : mut.significance === "pathogenic" ? "P" : "VUS"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MutationPanel;
