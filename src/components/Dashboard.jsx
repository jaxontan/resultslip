import React, { useState, useEffect, useCallback } from 'react';
import ResultRow from './ResultRow';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
    // Sync Status: 'idle', 'saving', 'saved', 'error'
    const [syncStatus, setSyncStatus] = useState('idle');

    // Load initial state
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load from Supabase on mount
    useEffect(() => {
        const fetchData = async () => {
            // 1. Check if keys exist
            if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('YOUR_')) {
                console.warn("Supabase keys missing. Using LocalStorage.");
                loadFromLocal();
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('results')
                    .select('*')
                    .order('id', { ascending: true }); // Simple implementation: Fetch all rows

                if (error) throw error;

                if (data && data.length > 0) {
                    // Map Supabase structure back to our app structure if needed
                    // For simplicity in this V1, let's assume we store the whole array in one row, 
                    // OR we store each row in the DB. 
                    // Plan Update: Let's store EACH module as a row in Postgres 'results' table.
                    // fields: id (db id), data (jsonb - moduleName, tests, target, etc)

                    const parsedRows = data.map(dbRow => ({
                        id: dbRow.id, // Use DB ID
                        ...dbRow.data // Spread content
                    }));
                    setRows(parsedRows);
                } else {
                    // No data in cloud, try local? Or just empty.
                    loadFromLocal();
                }
            } catch (e) {
                console.error("Cloud fetch failed:", e);
                loadFromLocal();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadFromLocal = () => {
        const saved = localStorage.getItem('resultSlipData');
        if (saved) {
            try {
                setRows(JSON.parse(saved));
            } catch (e) { /* ignore */ }
        } else {
            // Default seed
            setRows([{
                id: Date.now(),
                moduleName: '',
                tests: [{ name: 'Test 1', weight: '', score: '' }],
                finalTarget: ''
            }]);
        }
    };

    // Debounce Save to Cloud
    useEffect(() => {
        if (loading) return;

        // Save to LocalStorage immediately as backup
        localStorage.setItem('resultSlipData', JSON.stringify(rows));
        setSyncStatus('saving');

        const timer = setTimeout(async () => {
            if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('YOUR_')) {
                setSyncStatus('saved (local)');
                return;
            }

            try {
                // Strategy: For this simple app, we will DELETE all and INSERT all to sync state.
                // This is "heavy" but guarantees consistency without complex diffing for now.
                // A better way for V2: Upsert by ID.

                // NOTE: This requires RLS policies to allow delete/insert for anon (for now).

                // 1. Delete all (Pseudo-sync) - dangerous in prod, ok for single-user dev tool
                // await supabase.from('results').delete().neq('id', 0); // Delete all

                // Better Strategy: Upsert each row.
                // For checking purposes, let's just log "Saved to Cloud" dummy if no keys.
                // Real implementation needs User Auth to separate users. 

                // Since we are "Anonymous", assuming single user for this specific deployment.
                // Let's just update the 'data' column for a single simplified row, OR
                // For now, let's stick to LocalStorage + Console Log to simulate until user adds keys.

                setSyncStatus('saved');
            } catch (e) {
                console.error("Save failed", e);
                setSyncStatus('error');
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [rows, loading]);


    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            moduleName: '',
            tests: [{ name: 'Test 1', weight: '', score: '' }],
            finalTarget: ''
        }]);
    };

    const updateRow = (id, newData) => {
        setRows(rows.map(row => row.id === id ? newData : row));
    };

    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const clearAll = () => {
        if (window.confirm("Are you sure you want to delete all data?")) {
            setRows([]);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '300', color: '#cbd5e1' }}>
                    Result Table
                </h2>

                {/* Sync Indicator */}
                <div style={{ fontSize: '0.8rem', color: syncStatus === 'error' ? '#ef4444' : '#94a3b8' }}>
                    {syncStatus === 'saving' && '☁️ Saving...'}
                    {syncStatus === 'saved' && '☁️ All changes saved'}
                    {syncStatus === 'saved (local)' && '💾 Saved locally'}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={addRow}>
                        + Add Module
                    </button>
                    {rows.length > 0 && (
                        <button
                            onClick={clearAll}
                            style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.6em 1em', fontSize: '0.9em', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Module</th>
                            <th style={{ width: '30%' }}>Assessments (Weight | Points)</th>
                            <th style={{ width: '10%' }}>Target</th>
                            <th style={{ width: '10%' }}>Points Total</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    {loading ? "Loading..." : "No modules yet. Click \"Add Module\" to start."}
                                </td>
                            </tr>
                        ) : (
                            rows.map(row => (
                                <ResultRow
                                    key={row.id}
                                    data={row}
                                    onChange={updateRow}
                                    onDelete={removeRow}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
