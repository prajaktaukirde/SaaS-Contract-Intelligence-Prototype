
import { ContractStatus, RiskScore } from './types';

export const NAV_ITEMS = [
    { name: 'Contracts', path: '/contracts' },
    { name: 'Insights', path: '/insights' },
    { name: 'Upload', path: '/upload' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
];

export const STATUS_OPTIONS: ContractStatus[] = [
    ContractStatus.Active,
    ContractStatus.RenewalDue,
    ContractStatus.Expired,
];

export const RISK_OPTIONS: RiskScore[] = [
    RiskScore.Low,
    RiskScore.Medium,
    RiskScore.High,
];