import { GENES, type GeneInfo } from "@/data/genes";

interface GeneSelectorProps {
  selected: GeneInfo;
  onSelect: (gene: GeneInfo) => void;
}

const GeneSelector = ({ selected, onSelect }: GeneSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Select Gene
      </h3>
      <div className="grid gap-2">
        {GENES.map((gene) => {
          const isSelected = gene.symbol === selected.symbol;
          return (
            <button
              key={gene.symbol}
              onClick={() => onSelect(gene)}
              className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "border-primary/50 bg-primary/10 glow-primary"
                  : "border-border bg-card hover:border-primary/20 hover:bg-card/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-semibold text-sm text-foreground">
                  {gene.symbol}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {gene.chromosome}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {gene.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GeneSelector;
