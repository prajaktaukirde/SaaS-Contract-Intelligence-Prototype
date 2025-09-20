
import React, { useState, useEffect, useMemo } from 'react';
import { fetchContracts } from '../services/mockApi';
import type { Contract, ContractStatus, RiskScore } from '../types';
import { STATUS_OPTIONS, RISK_OPTIONS } from '../constants';
import Spinner from '../components/ui/Spinner';
import Tag from '../components/ui/Tag';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContractStatus | 'All'>('All');
    const [riskFilter, setRiskFilter] = useState<RiskScore | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const loadContracts = async () => {
            try {
                setLoading(true);
                const data = await fetchContracts();
                setContracts(data);
            } catch (err) {
                setError('Failed to fetch contracts.');
            } finally {
                setLoading(false);
            }
        };
        loadContracts();
    }, []);

    const filteredContracts = useMemo(() => {
        return contracts
            .filter(c => searchTerm === '' || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.parties.join(', ').toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(c => statusFilter === 'All' || c.status === statusFilter)
            .filter(c => riskFilter === 'All' || c.riskScore === riskFilter);
    }, [contracts, searchTerm, statusFilter, riskFilter]);

    const paginatedContracts = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredContracts.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredContracts, currentPage]);

    const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

    const renderContent = () => {
        if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
        if (error) return <div className="text-center text-red-500 p-10">{error}</div>;
        if (filteredContracts.length === 0) return <div className="text-center text-gray-500 p-10">No contracts found.</div>;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Contract Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Parties</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Expiry Date</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Risk Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {paginatedContracts.map((contract) => (
                            <tr key={contract.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <Link to={`/contracts/${contract.id}`} className="text-brand-primary hover:underline font-medium">{contract.name}</Link>
                                </td>
                                <td className="py-3 px-4">{contract.parties.join(', ')}</td>
                                <td className="py-3 px-4">{contract.expiryDate}</td>
                                <td className="py-3 px-4"><Tag type="status" value={contract.status} /></td>
                                <td className="py-3 px-4"><Tag type="risk" value={contract.riskScore} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contracts Dashboard</h1>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or parties..."
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'All')}
                    >
                        <option value="All">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value as RiskScore | 'All')}
                    >
                        <option value="All">All Risk Levels</option>
                        {RISK_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                {renderContent()}
                {totalPages > 1 && (
                     <div className="p-4 flex justify-between items-center">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
