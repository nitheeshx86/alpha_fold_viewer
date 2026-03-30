export interface Mutation {
  gene: string;
  position: number;
  wildType: string;
  mutant: string;
  label: string;
  frequency: number; // percentage in cancer samples
  cancerType: string;
  significance: "pathogenic" | "likely_pathogenic" | "vus";
}

export const MUTATIONS: Record<string, Mutation[]> = {
  TP53: [
    { gene: "TP53", position: 175, wildType: "R", mutant: "H", label: "R175H", frequency: 6.1, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 248, wildType: "R", mutant: "W", label: "R248W", frequency: 4.4, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 273, wildType: "R", mutant: "H", label: "R273H", frequency: 3.8, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 249, wildType: "R", mutant: "S", label: "R249S", frequency: 2.9, cancerType: "Hepatocellular", significance: "pathogenic" },
    { gene: "TP53", position: 245, wildType: "G", mutant: "S", label: "G245S", frequency: 2.3, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 282, wildType: "R", mutant: "W", label: "R282W", frequency: 1.9, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 220, wildType: "Y", mutant: "C", label: "Y220C", frequency: 1.5, cancerType: "Pan-cancer", significance: "pathogenic" },
    { gene: "TP53", position: 176, wildType: "C", mutant: "F", label: "C176F", frequency: 1.1, cancerType: "Pan-cancer", significance: "likely_pathogenic" },
  ],
  EGFR: [
    { gene: "EGFR", position: 858, wildType: "L", mutant: "R", label: "L858R", frequency: 40.0, cancerType: "NSCLC", significance: "pathogenic" },
    { gene: "EGFR", position: 790, wildType: "T", mutant: "M", label: "T790M", frequency: 15.0, cancerType: "NSCLC", significance: "pathogenic" },
    { gene: "EGFR", position: 719, wildType: "G", mutant: "S", label: "G719S", frequency: 3.0, cancerType: "NSCLC", significance: "pathogenic" },
    { gene: "EGFR", position: 861, wildType: "L", mutant: "Q", label: "L861Q", frequency: 2.0, cancerType: "NSCLC", significance: "likely_pathogenic" },
    { gene: "EGFR", position: 797, wildType: "C", mutant: "S", label: "C797S", frequency: 5.0, cancerType: "NSCLC", significance: "pathogenic" },
  ],
  BRCA1: [
    { gene: "BRCA1", position: 1699, wildType: "R", mutant: "W", label: "R1699W", frequency: 0.5, cancerType: "Breast", significance: "pathogenic" },
    { gene: "BRCA1", position: 1775, wildType: "M", mutant: "R", label: "M1775R", frequency: 0.3, cancerType: "Breast/Ovarian", significance: "pathogenic" },
    { gene: "BRCA1", position: 61, wildType: "C", mutant: "G", label: "C61G", frequency: 0.8, cancerType: "Breast", significance: "pathogenic" },
    { gene: "BRCA1", position: 1749, wildType: "S", mutant: "del", label: "S1749del", frequency: 0.2, cancerType: "Breast/Ovarian", significance: "likely_pathogenic" },
  ],
};
