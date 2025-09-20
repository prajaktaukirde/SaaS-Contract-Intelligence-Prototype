import React, { useState, useEffect, useMemo } from 'react';
import { fetchContracts } from '../services/mockApi';
import type { Contract } from '../types';
import { ContractStatus, RiskScore } from '../types';
import Spinner from '../components/ui/Spinner';

const SummaryBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-500">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const ReportsPage: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContracts = async () => {
            try {
                setLoading(true);
                const data = await fetchContracts();
                setContracts(data);
            } catch (err) {
                setError('Failed to fetch contract data for reports.');
            } finally {
                setLoading(false);
            }
        };
        loadContracts();
    }, []);

    const statusSummary = useMemo(() => {
        const summary = {
            [ContractStatus.Active]: 0,
            [ContractStatus.RenewalDue]: 0,
            [ContractStatus.Expired]: 0,
        };
        contracts.forEach(c => {
            if (c.status in summary) {
                summary[c.status]++;
            }
        });
        return summary;
    }, [contracts]);

    const riskSummary = useMemo(() => {
        const summary = {
            [RiskScore.Low]: 0,
            [RiskScore.Medium]: 0,
            [RiskScore.High]: 0,
        };
        contracts.forEach(c => {
            if (c.riskScore in summary) {
                summary[c.riskScore]++;
            }
        });
        return summary;
    }, [contracts]);

    const upcomingExpirations = useMemo(() => {
        const now = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(now.getDate() + 90);
        return contracts
            .filter(c => {
                const expiryDate = new Date(c.expiryDate);
                return expiryDate > now && expiryDate <= ninetyDaysFromNow;
            })
            .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
    }, [contracts]);

    if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
    if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Contract Status Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Contract Status Summary</h2>
                    <div className="space-y-4">
                        <SummaryBar label="Active" value={statusSummary.Active} total={contracts.length} color="bg-status-active" />
                        <SummaryBar label="Renewal Due" value={statusSummary['Renewal Due']} total={contracts.length} color="bg-status-renewal" />
                        <SummaryBar label="Expired" value={statusSummary.Expired} total={contracts.length} color="bg-status-expired" />
                    </div>
                </div>

                {/* Risk Profile Overview */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Risk Profile Overview</h2>
                     <div className="space-y-4">
                        <SummaryBar label="Low Risk" value={riskSummary.Low} total={contracts.length} color="bg-risk-low" />
                        <SummaryBar label="Medium Risk" value={riskSummary.Medium} total={contracts.length} color="bg-risk-medium" />
                        <SummaryBar label="High Risk" value={riskSummary.High} total={contracts.length} color="bg-risk-high" />
                    </div>
                </div>

                {/* Upcoming Expirations */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Contracts Expiring in Next 90 Days</h2>
                    {upcomingExpirations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Contract Name</th>
                                        <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Parties</th>
                                        <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Expiry Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingExpirations.map(contract => (
                                        <tr key={contract.id} className="border-b">
                                            <td className="py-2 px-3">{contract.name}</td>
                                            <td className="py-2 px-3">{contract.parties.join(', ')}</td>
                                            <td className="py-2 px-3">{contract.expiryDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No contracts are expiring in the next 90 days.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
