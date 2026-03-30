export interface MappingResult {
  structureIndex: number | null;
  isExactMatch: boolean;
  warning?: string;
  plddt?: number; // AlphaFold confidence score
}

const AMINO_ACID_MAP: Record<string, string> = {
  ALA: "A", CYS: "C", ASP: "D", GLU: "E", PHE: "F",
  GLY: "G", HIS: "H", ILE: "I", LYS: "K", LEU: "L",
  MET: "M", ASN: "N", PRO: "P", GLN: "Q", ARG: "R",
  SER: "S", THR: "T", VAL: "V", TRP: "W", TYR: "Y",
};

// Caches to avoid redundant network requests
const uniprotCache = new Map<string, string>();
const pdbCache = new Map<string, { seq: string; residues: { index: number; plddt: number }[] }>();

/**
 * Fetches the canonical FASTA sequence for a UniProt ID.
 */
async function fetchUniProtSequence(uniprotId: string): Promise<string> {
  if (uniprotCache.has(uniprotId)) {
    return uniprotCache.get(uniprotId)!;
  }

  const res = await fetch(`https://rest.uniprot.org/uniprotkb/${uniprotId}.fasta`);
  if (!res.ok) throw new Error("Failed to fetch UniProt sequence");
  
  const text = await res.text();
  // FASTA format: first line is header (>...), rest is sequence
  const lines = text.split("\n");
  const sequence = lines.slice(1).join("").replace(/\s/g, "");
  
  uniprotCache.set(uniprotId, sequence);
  return sequence;
}

/**
 * Fetches and parses an AlphaFold PDB to extract CA sequence and pLDDT.
 */
async function fetchStructureData(uniprotId: string) {
  if (pdbCache.has(uniprotId)) {
    return pdbCache.get(uniprotId)!;
  }

  const url = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.pdb`;
  const res = await fetch(url);
  
  // Use v4 as fallback if latest doesn't work, though standardizing on a version is good.
  // In production, we could loop over versions like it's done in components.
  if (!res.ok) throw new Error("Failed to fetch AlphaFold PDB");

  const pdbText = await res.text();
  const residues: { index: number; plddt: number }[] = [];
  let seq = "";

  const lines = pdbText.split("\n");
  let lastResIndex = -1;

  for (const line of lines) {
    if (line.startsWith("ATOM  ") || line.startsWith("HETATM")) {
      const atomName = line.substring(12, 16).trim();
      
      // Look only at Alpha Carbons (CA) to get exactly one atom per residue
      if (atomName === "CA") {
        const resName = line.substring(17, 20).trim();
        const resIndex = parseInt(line.substring(22, 26).trim(), 10);
        const plddt = parseFloat(line.substring(60, 66).trim());

        if (resIndex !== lastResIndex) {
          seq += AMINO_ACID_MAP[resName] || "X";
          residues.push({ index: resIndex, plddt });
          lastResIndex = resIndex;
        }
      }
    }
  }

  const result = { seq, residues };
  pdbCache.set(uniprotId, result);
  return result;
}

/**
 * Maps a mutation position from UniProt to the AlphaFold structure index.
 */
export async function mapMutationToStructure({
  uniprotId,
  mutationPosition,
  expectedAminoAcid,
}: {
  uniprotId: string;
  mutationPosition: number;
  expectedAminoAcid?: string;
}): Promise<MappingResult> {
  try {
    const [uniprotSeq, structureData] = await Promise.all([
      fetchUniProtSequence(uniprotId),
      fetchStructureData(uniprotId),
    ]);

    // Validation 1: Check Lengths
    const lengthMismatch = uniprotSeq.length !== structureData.seq.length;

    // UniProt indices are 1-based.
    const uniProtResidue = uniprotSeq[mutationPosition - 1];

    if (expectedAminoAcid && uniProtResidue !== expectedAminoAcid) {
      return {
        structureIndex: null,
        isExactMatch: false,
        warning: `Mismatch in UniProt expected vs observed: expected ${expectedAminoAcid}, found ${uniProtResidue}.`,
      };
    }

    // Attempt direct mapping (residue indices usually align 1:1 in AlphaFold)
    // We try to find the structure residue whose ID == mutationPosition.
    let matchedResidue = structureData.residues.find((r) => r.index === mutationPosition);

    if (matchedResidue) {
      // Find its 0-based index in the structure's extracted sequence
      const seqIndex = structureData.residues.indexOf(matchedResidue);
      const structResidue = structureData.seq[seqIndex];

      if (structResidue === uniProtResidue) {
        return {
          structureIndex: matchedResidue.index,
          isExactMatch: !lengthMismatch,
          plddt: matchedResidue.plddt,
          warning: lengthMismatch ? "Mapped correctly, but total sequence length differs." : undefined,
        };
      }
    }

    // If direct positional alignment failed, attempt a simple sliding window search
    // (A 5-residue neighborhood sequence match around the mutation)
    const neighborhoodStart = Math.max(0, mutationPosition - 3);
    const neighborhoodEnd = Math.min(uniprotSeq.length, mutationPosition + 2);
    const windowSeq = uniprotSeq.substring(neighborhoodStart, neighborhoodEnd);
    
    const structWindowIndex = structureData.seq.indexOf(windowSeq);
    
    if (structWindowIndex !== -1) {
      // Offset from the start of the window
      const targetIndex = structWindowIndex + (mutationPosition - 1 - neighborhoodStart);
      const foundResidueMetadata = structureData.residues[targetIndex];

      return {
        structureIndex: foundResidueMetadata.index,
        isExactMatch: false,
        plddt: foundResidueMetadata.plddt,
        warning: "Residue mapped using sequence alignment due to coordinate offset.",
      };
    }

    return {
      structureIndex: null,
      isExactMatch: false,
      warning: "Could not align UniProt sequence to Structure correctly.",
    };
    
  } catch (err: any) {
    return {
      structureIndex: null,
      isExactMatch: false,
      warning: `Mapping failed: ${err.message}`,
    };
  }
}
