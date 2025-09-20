
import React, { useState } from 'react';
import { askQuestion } from '../services/mockApi';
import type { QueryResult } from '../types';
import Spinner from '../components/ui/Spinner';

const InsightsPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<QueryResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const data = await askQuestion(query);
            setResult(data);
        } catch (err) {
            setError('Failed to get insights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Query Your Contracts</h1>
            <p className="text-gray-600 mb-6">Ask a question in natural language to find information across all your uploaded documents.</p>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'What is the liability cap for Innovate Inc.?'"
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-secondary disabled:bg-gray-400"
                        >
                            {loading ? 'Thinking...' : 'Ask AI'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8">
                {loading && <div className="flex justify-center p-10"><Spinner /></div>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {result && (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Answer</h2>
                            <p className="text-gray-700 leading-relaxed">{result.answer}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Retrieved Chunks</h2>
                            <div className="space-y-4">
                                {result.chunks.map(chunk => (
                                    <div key={chunk.id} className="border-b pb-4 last:border-b-0">
                                        <p className="text-gray-700 italic">"{chunk.text}"</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            <span>Page: {chunk.page}</span> | <span className="font-medium">Relevance: {chunk.relevance}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsPage;
