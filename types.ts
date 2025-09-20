
export interface User {
  id: string;
  username: string;
  email: string;
}

export enum ContractStatus {
  Active = 'Active',
  RenewalDue = 'Renewal Due',
  Expired = 'Expired',
}

export enum RiskScore {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Contract {
  id: string;
  name: string;
  parties: string[];
  expiryDate: string;
  status: ContractStatus;
  riskScore: RiskScore;
  uploadedOn: string;
}

export interface Clause {
  id: string;
  title: string;
  text: string;
  confidence: number;
}

export interface AIInsight {
  id: string;
  type: 'Risk' | 'Recommendation';
  text: string;
}

export interface EvidenceChunk {
  id: string;
  text: string;
  page: number;
  relevance: number;
}

export interface ContractDetails extends Contract {
  clauses: Clause[];
  insights: AIInsight[];
  evidence: EvidenceChunk[];
}

export interface QueryResult {
  answer: string;
  chunks: EvidenceChunk[];
}
