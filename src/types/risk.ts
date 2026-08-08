import { ActivityType } from './location';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface RiskFactor {
  category: 'weather' | 'crime' | 'news' | 'activity';
  level: RiskLevel;
  title: string;
  detail: string;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  numericalScore: number; // 0 to 100 (100 = safest)
  factors: {
    weatherRisk: RiskLevel;
    crimeRisk: RiskLevel;
    newsRisk: RiskLevel;
    activityRisk: RiskLevel;
  };
  explanation: string;
  recommendations: string[];
  officialWarning?: {
    title: string;
    description: string;
    issuedBy: string;
  };
  evaluatedActivity: ActivityType;
}
