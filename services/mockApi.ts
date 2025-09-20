
import { ContractStatus, RiskScore } from '../types';
import type { Contract, ContractDetails, QueryResult } from '../types';

const MOCK_CONTRACTS: Contract[] = [
    { id: 'doc123', name: 'Master Services Agreement.pdf', parties: ['Innovate Inc.', 'Solutions Corp.'], expiryDate: '2025-12-31', status: ContractStatus.Active, riskScore: RiskScore.Low, uploadedOn: '2023-01-15' },
    { id: 'doc124', name: 'Non-Disclosure Agreement.docx', parties: ['Stealth Co.', 'Partner LLC'], expiryDate: '2024-08-01', status: ContractStatus.RenewalDue, riskScore: RiskScore.Medium, uploadedOn: '2023-02-20' },
    { id: 'doc125', name: 'Software Licensing Agreement.pdf', parties: ['Tech Giant', 'StartupX'], expiryDate: '2023-06-30', status: ContractStatus.Expired, riskScore: RiskScore.High, uploadedOn: '2022-07-01' },
    { id: 'doc126', name: 'Lease Agreement - HQ.pdf', parties: ['Property Group', 'Innovate Inc.'], expiryDate: '2026-05-31', status: ContractStatus.Active, riskScore: RiskScore.Low, uploadedOn: '2021-05-15' },
    { id: 'doc127', name: 'Vendor Contract - V1.txt', parties: ['Innovate Inc.', 'SupplyChain Ltd.'], expiryDate: '2024-09-15', status: ContractStatus.RenewalDue, riskScore: RiskScore.Medium, uploadedOn: '2023-09-10' },
];

const MOCK_CONTRACT_DETAILS: { [key: string]: ContractDetails } = {
    'doc123': {
        ...MOCK_CONTRACTS[0],
        clauses: [
            { id: 'c1', title: 'Termination', text: 'Either party may terminate this Agreement with 90 days written notice to the other party.', confidence: 98.5 },
            { id: 'c2', title: 'Confidentiality', text: 'Both parties agree to maintain the confidentiality of all proprietary information disclosed during the term of this Agreement.', confidence: 99.2 },
            { id: 'c3', title: 'Liability', text: 'The total liability of either party shall not exceed the total fees paid in the preceding 12 months.', confidence: 95.0 },
        ],
        insights: [
            { id: 'i1', type: 'Risk', text: 'The 90-day termination clause is longer than the industry standard of 30-60 days, potentially locking you in.' },
            { id: 'i2', type: 'Recommendation', text: 'Consider renegotiating the termination notice period to 60 days for greater flexibility.' },
        ],
        evidence: [
            { id: 'e1', text: '...terminate this Agreement with 90 days written notice...', page: 5, relevance: 99.8 },
            { id: 'e2', text: '...liability of either party shall not exceed the total fees...', page: 8, relevance: 92.1 },
        ]
    },
};

export const fetchContracts = (): Promise<Contract[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_CONTRACTS);
        }, 1000);
    });
};

export const fetchContractById = (id: string): Promise<ContractDetails | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_CONTRACT_DETAILS[id]);
        }, 800);
    });
};

export const askQuestion = (query: string): Promise<QueryResult> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                answer: `Based on the documents, the liability is capped at the total fees paid in the preceding 12 months. This is a standard clause but should be reviewed for high-value contracts. The termination clause requires a 90-day notice period.`,
                chunks: [
                    { id: 'e1', text: 'The total liability of either party shall not exceed the total fees paid in the preceding 12 months.', page: 8, relevance: 98.2 },
                    { id: 'e2', text: 'Either party may terminate this Agreement with 90 days written notice to the other party.', page: 5, relevance: 95.7 },
                    { id: 'e3', text: 'This agreement is governed by the laws of the State of California.', page: 12, relevance: 78.4 },
                ]
            });
        }, 1500);
    });
};

// Simulate file upload and parsing
export const uploadAndParseFile = (file: File): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, this would be a multi-step process.
            // Here, we just simulate success.
            resolve({ success: true });
        }, 2500);
    });
};
