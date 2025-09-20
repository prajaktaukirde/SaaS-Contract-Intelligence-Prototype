
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchContractById } from '../services/mockApi';
import type { ContractDetails } from '../types';
import Spinner from '../components/ui/Spinner';
import Tag from '../components/ui/Tag';

const ContractDetailHeader: React.FC<{ contract: ContractDetails }> = ({ contract }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{contract.name}</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600">
            <span><strong>Parties:</strong> {contract.parties.join(', ')}</span>
            <span><strong>Expiry Date:</strong> {contract.expiryDate}</span>
            <span><strong>Uploaded:</strong> {contract.uploadedOn}</span>
            <div className="flex items-center gap-2"><strong>Status:</strong> <Tag type="status" value={contract.status} /></div>
            <div className="flex items-center gap-2"><strong>Risk:</strong> <Tag type="risk" value={contract.riskScore} /></div>
        </div>
    </div>
);

const ClauseCard: React.FC<{ clause: ContractDetails['clauses'][0] }> = ({ clause }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-brand-primary">{clause.title}</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Confidence: {clause.confidence}%
            </span>
        </div>
        <p className="text-gray-700">{clause.text}</p>
    </div>
);

const InsightsList: React.FC<{ insights: ContractDetails['insights'] }> = ({ insights }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Insights</h2>
        <ul className="space-y-4">
            {insights.map(insight => (
                <li key={insight.id} className="flex items-start">
                    <span className={`mr-3 mt-1 w-5 h-5 rounded-full flex-shrink-0 ${insight.type === 'Risk' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <div>
                        <h4 className="font-semibold">{insight.type}</h4>
                        <p className="text-gray-600">{insight.text}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const EvidenceDrawer: React.FC<{ evidence: ContractDetails['evidence'], isOpen: boolean, onClose: () => void }> = ({ evidence, isOpen, onClose }) => (
    <div className={`fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-30 p-6`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Evidence Snippets</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="space-y-4">
            {evidence.map(chunk => (
                 <div key={chunk.id} className="border-b pb-4">
                    <p className="text-gray-700 italic">"{chunk.text}"</p>
                    <div className="text-sm text-gray-500 mt-2">
                        <span>Page: {chunk.page}</span> | <span className="font-medium">Relevance: {chunk.relevance}%</span>
                    </div>
                 </div>
            ))}
        </div>
    </div>
);


const ContractDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<ContractDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("No contract ID provided.");
            setLoading(false);
            return;
        }
        const loadContract = async () => {
            try {
                setLoading(true);
                const data = await fetchContractById(id);
                if (data) {
                    setContract(data);
                } else {
                    setError('Contract not found.');
                }
            } catch (err) {
                setError('Failed to fetch contract details.');
            } finally {
                setLoading(false);
            }
        };
        loadContract();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-center text-red-500 p-10">{error}</div>;
    if (!contract) return null;

    return (
        <div className="container mx-auto">
             <Link to="/contracts" className="text-brand-primary hover:underline mb-4 inline-block">&larr; Back to Contracts</Link>
            <ContractDetailHeader contract={contract} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Key Clauses</h2>
                            <button onClick={() => setIsDrawerOpen(true)} className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-brand-secondary">Show Evidence</button>
                        </div>
                        <div className="space-y-4">
                            {contract.clauses.map(clause => <ClauseCard key={clause.id} clause={clause} />)}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <InsightsList insights={contract.insights} />
                </div>
            </div>

            <EvidenceDrawer evidence={contract.evidence} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            {isDrawerOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsDrawerOpen(false)}></div>}
        </div>
    );
};

export default ContractDetailPage;
