import React, { useState, useEffect } from 'react';
import ResultRow from './ResultRow';

const Dashboard = () => {
    // Load initial state from localStorage or default to empty list
    const [rows, setRows] = useState(() => {
        const saved = localStorage.getItem('resultSlipData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: Check if old structure exists and migrate if needed
                return parsed.map(row => ({
                    ...row,
                    tests: row.tests.map(t => ({
                        name: t.name,
                        // Ensure weight/score exist if migrating from old 'percentage' field
                        weight: t.weight || '',
                        score: t.score || t.percentage || ''
                    }))
                }));
            } catch (e) {
                console.error("Failed to parse local storage", e);
                return [];
            }
        }
        // Default initial state
        return [{
            id: Date.now(),
            moduleName: '',
            tests: [{ name: 'Test 1', weight: '', score: '' }],
            finalTarget: ''
        }];
    });

    // Save to localStorage whenever rows change
    useEffect(() => {
        localStorage.setItem('resultSlipData', JSON.stringify(rows));
    }, [rows]);

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
                            <th style={{ width: '30%' }}>Assessments (Weight | Score)</th>
                            <th style={{ width: '10%' }}>Target</th>
                            <th style={{ width: '10%' }}>Total %</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    No modules yet. Click "Add Module" to start.
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
