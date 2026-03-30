import { useState } from "react";
import { GENES, type GeneInfo } from "@/data/genes";
import { MUTATIONS } from "@/data/mutations";
import ProteinViewer from "@/components/ProteinViewer";
import GeneSelector from "@/components/GeneSelector";
import MutationPanel from "@/components/MutationPanel";
import InfoPanel from "@/components/InfoPanel";

const Index = () => {
  const [selectedGene, setSelectedGene] = useState<GeneInfo>(GENES[0]);
  const [showMutations, setShowMutations] = useState(true);

  const mutations = MUTATIONS[selectedGene.symbol] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-sm font-mono font-semibold text-foreground tracking-tight">
              AlphaFold Mutation Viewer
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Cancer mutations on predicted protein structures
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded bg-secondary border border-border">
            {selectedGene.name}
          </span>
          <span className="text-[10px] font-mono text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20">
            UniProt: {selectedGene.uniprotId}
          </span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border p-4 space-y-6 overflow-y-auto shrink-0">
          <GeneSelector selected={selectedGene} onSelect={setSelectedGene} />
          <div className="h-px bg-border" />
          <MutationPanel
            mutations={mutations}
            showMutations={showMutations}
            onToggle={() => setShowMutations(!showMutations)}
          />
          <div className="h-px bg-border" />
          <InfoPanel />
        </aside>

        {/* Viewer */}
        <main className="flex-1 p-4 min-h-0">
          <ProteinViewer
            key={selectedGene.symbol}
            gene={selectedGene}
            mutations={mutations}
            showMutations={showMutations}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
