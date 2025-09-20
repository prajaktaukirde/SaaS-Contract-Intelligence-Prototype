
import React from 'react';
// FIX: Changed `import type` to `import` to allow enums to be used as values.
import { ContractStatus, RiskScore } from '../../types';

interface TagProps {
    type: 'status' | 'risk';
    value: ContractStatus | RiskScore;
}

const Tag: React.FC<TagProps> = ({ type, value }) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";

    const typeClasses = {
        status: {
            [ContractStatus.Active]: 'bg-green-100 text-status-active',
            [ContractStatus.RenewalDue]: 'bg-yellow-100 text-status-renewal',
            [ContractStatus.Expired]: 'bg-red-100 text-status-expired',
        },
        risk: {
            [RiskScore.Low]: 'text-risk-low',
            [RiskScore.Medium]: 'text-risk-medium',
            [RiskScore.High]: 'text-risk-high',
        }
    };
    
    const riskTextClass = `font-semibold ${typeClasses.risk[value as RiskScore] || ''}`;

    if (type === 'risk') {
        return <span className={riskTextClass}>{value}</span>
    }

    return (
        <span className={`${baseClasses} ${typeClasses.status[value as ContractStatus] || ''}`}>
            {value}
        </span>
    );
};

export default Tag;