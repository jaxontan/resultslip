import React, { useEffect, useState } from 'react';

const ResultRow = ({ data, onChange, onDelete }) => {
    const { id, moduleName, tests, finalTarget, predictedScore } = data;
    const [statusColor, setStatusColor] = useState('gray');
    const [statusMessage, setStatusMessage] = useState('Start');

    // Logic to determine color and message (Visual logic stays here for simplicity, but data is from props)
    useEffect(() => {
        if (!finalTarget || !predictedScore) {
            setStatusColor('gray');
            setStatusMessage('Needs Data');
            return;
        }

        const target = parseFloat(finalTarget);
        const score = parseFloat(predictedScore);

        if (isNaN(target) || isNaN(score)) return;

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
    }, [finalTarget, predictedScore]);

    // Handle generic field update
    const handleChange = (field, value) => {
        onChange(id, { ...data, [field]: value });
    };

    const addTest = () => {
        const newTests = [...tests, { name: `Test ${tests.length + 1}`, percentage: '' }];
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
                    {tests.map((test, index) => (
                        <div key={index} className="flex-row" style={{ gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={test.name}
                                onChange={(e) => updateTest(index, 'name', e.target.value)}
                                style={{ width: '80px', padding: '0.3rem', fontSize: '0.8rem' }}
                            />
                            <input
                                type="number"
                                placeholder="%"
                                value={test.percentage}
                                onChange={(e) => updateTest(index, 'percentage', e.target.value)}
                                style={{ width: '60px', padding: '0.3rem', fontSize: '0.8rem' }}
                            />
                            {tests.length > 1 && (
                                <button onClick={() => removeTest(index)} className="btn-icon-danger">×</button>
                            )}
                        </div>
                    ))}
                    <button className="btn-xs-outline" onClick={addTest}>+ Add</button>
                </div>
            </td>

            {/* Target */}
            <td style={{ verticalAlign: 'top' }}>
                <input
                    type="number"
                    placeholder="%"
                    value={finalTarget}
                    onChange={(e) => handleChange('finalTarget', e.target.value)}
                    style={{ width: '70px', textAlign: 'center' }}
                />
            </td>

            {/* Predicted/Actual */}
            <td style={{ verticalAlign: 'top' }}>
                <input
                    type="number"
                    placeholder="%"
                    value={predictedScore}
                    onChange={(e) => handleChange('predictedScore', e.target.value)}
                    style={{ width: '70px', textAlign: 'center' }}
                />
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
