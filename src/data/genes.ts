export interface GeneInfo {
  symbol: string;
  name: string;
  uniprotId: string;
  description: string;
  chromosome: string;
}

export const GENES: GeneInfo[] = [
  {
    symbol: "TP53",
    name: "Tumor Protein P53",
    uniprotId: "P04637",
    description: "Guardian of the genome. Most frequently mutated gene in human cancers.",
    chromosome: "17p13.1",
  },
  {
    symbol: "EGFR",
    name: "Epidermal Growth Factor Receptor",
    uniprotId: "P00533",
    description: "Key driver in lung cancer. Target for tyrosine kinase inhibitors.",
    chromosome: "7p11.2",
  },
  {
    symbol: "BRCA1",
    name: "BRCA1 DNA Repair Associated",
    uniprotId: "P38398",
    description: "Critical for DNA double-strand break repair. Associated with breast and ovarian cancer.",
    chromosome: "17q21.31",
  },
];

export function getAlphaFoldUrls(uniprotId: string): string[] {
  return [
    `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v6.pdb`,
    `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v5.pdb`,
    `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.pdb`,
    `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v6.cif`,
  ];
}
