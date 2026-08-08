export interface YearlyCrimeRecord {
  year: number;
  totalReportedCases: number;
  theftAndRobbery: number;
  violentCrime: number;
  touristTargetedIncidents: number;
  fraudAndScams: number;
}

export interface CrimeData {
  region: string;
  source: string; // e.g. "National Crime Records Bureau (NCRB) & Public Data"
  lastUpdated: string;
  yearlyTrends: YearlyCrimeRecord[];
  safetyRatingText: string;
  isDemoData?: boolean;
}
