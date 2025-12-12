import React, { useEffect, useState, useMemo } from 'react';

const ResultRow = ({ data, onChange, onDelete }) => {
    const { id, moduleName, tests, finalTarget } = data;
    const [statusColor, setStatusColor] = useState('gray');
    const [statusMessage, setStatusMessage] = useState('Start');

    // Calculate Sum of Scores & Total Weight
    const { calculatedScore, totalWeight } = useMemo(() => {
        let totalScore = 0;
        let totalW = 0;

        tests.forEach(test => {
            const w = parseFloat(test.weight) || 0;
            const s = parseFloat(test.score) || 0;
            totalScore += s; // Simply sum the scores (Points Obtained)
            totalW += w;
        });

        return { calculatedScore: totalScore.toFixed(1), totalWeight: totalW };
    }, [tests]);

    // Status Logic
    useEffect(() => {
        if (!finalTarget) {
            setStatusColor('gray');
            setStatusMessage('Set Target');
            return;
        }

        const target = parseFloat(finalTarget);
        const score = parseFloat(calculatedScore);

        if (isNaN(target)) return;

        const diff = score - target;

        if (diff >= 0) {
            setStatusColor('#22c55e'); // Green
            setStatusMessage('Excellent');
        } else if (diff >= -10) {
            setStatusColor('#eab308'); // Yellow
            setStatusMessage('Close');
        } else {
            setStatusColor('#ef4444'); // Red
            setStatusMessage('Action Req');
        }
    }, [finalTarget, calculatedScore]);

    // Handle generic field update
    const handleChange = (field, value) => {
        onChange(id, { ...data, [field]: value });
    };

    const addTest = () => {
        const newTests = [...tests, { name: `Test ${tests.length + 1}`, weight: '', score: '' }];
        handleChange('tests', newTests);
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = value;
        handleChange('tests', newTests);
    };

    const removeTest = (index) => {
        const newTests = tests.filter((_, i) => i !== index);
        handleChange('tests', newTests);
    };

    return (
        <tr className="glass-row">
            {/* Module Name */}
            <td style={{ verticalAlign: 'top' }}>
                <input
                    type="text"
                    placeholder="Module Name"
                    value={moduleName}
                    onChange={(e) => handleChange('moduleName', e.target.value)}
                    style={{ width: '100%', fontWeight: 'bold' }}
                />
            </td>

            {/* Assessments */}
            <td style={{ verticalAlign: 'top' }}>
                <div className="flex-col" style={{ gap: '0.5rem' }}>
                    {/* Header */}
                    {tests.length > 0 && (
                        <div className="flex-row" style={{ fontSize: '0.75rem', color: '#94a3b8', paddingLeft: '4px' }}>
                            <span style={{ width: '80px' }}>Test Name</span>
                            <span style={{ width: '60px' }}>Weight %</span>
                            <span style={{ width: '60px' }}>Points</span>
                        </div>
                    )}

                    {tests.map((test, index) => (
                        <div key={index} className="flex-row" style={{ gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Test"
                                value={test.name}
                                onChange={(e) => updateTest(index, 'name', e.target.value)}
                                style={{ width: '80px', padding: '0.3rem', fontSize: '0.8rem' }}
                            />
                            <input
                                type="number"
                                placeholder="W%"
                                value={test.weight}
                                onChange={(e) => updateTest(index, 'weight', e.target.value)}
                                style={{
                                    width: '60px', padding: '0.3rem', fontSize: '0.8rem',
                                    borderColor: totalWeight !== 100 && test.weight ? '#eab308' : 'var(--glass-border)'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Scr%"
                                value={test.score}
                                onChange={(e) => updateTest(index, 'score', e.target.value)}
                                style={{ width: '60px', padding: '0.3rem', fontSize: '0.8rem' }}
                            />
                            {tests.length > 1 && (
                                <button onClick={() => removeTest(index)} className="btn-icon-danger">×</button>
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn-xs-outline" onClick={addTest}>+ Add Assessment</button>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: totalWeight === 100 ? '#22c55e' : (totalWeight > 100 ? '#ef4444' : '#eab308')
                        }}>
                            Total: {totalWeight}%
                        </span>
                    </div>
                </div>
            </td>

            {/* Target */}
            <td style={{ verticalAlign: 'top' }}>
                <input
                    type="number"
                    placeholder="%"
                    value={finalTarget}
                    onChange={(e) => handleChange('finalTarget', e.target.value)}
                    style={{ width: '70px', textAlign: 'center', marginTop: '1.2rem' }}
                />
            </td>

            {/* Calculated Score */}
            <td style={{ verticalAlign: 'top' }}>
                <div style={{
                    marginTop: '1.2rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: calculatedScore >= parseFloat(finalTarget) ? '#22c55e' : 'white'
                }}>
                    {calculatedScore}
                </div>
            </td>

            {/* Status */}
            <td style={{ verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`status-badge`} style={{ backgroundColor: statusColor }}>
                        {statusMessage}
                    </div>
                </div>
            </td>

            {/* Actions */}
            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <button className="btn-icon-danger" onClick={() => onDelete(id)} title="Delete Module">
                    ✕
                </button>
            </td>
        </tr>
    );
};

export default ResultRow;
