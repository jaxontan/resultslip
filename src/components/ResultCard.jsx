import React, { useState, useEffect } from 'react';

const ResultCard = ({ id, onDelete }) => {
  const [moduleName, setModuleName] = useState('');
  const [tests, setTests] = useState([{ name: 'Test 1', percentage: '' }]);
  const [finalTarget, setFinalTarget] = useState('');
  const [predictedScore, setPredictedScore] = useState('');
  const [statusColor, setStatusColor] = useState('gray');
  const [statusMessage, setStatusMessage] = useState('Set a target and score');

  // Logic to determine color and message
  useEffect(() => {
    if (!finalTarget || !predictedScore) {
      setStatusColor('gray');
      setStatusMessage('Enter target and predicted/actual score');
      return;
    }

    const target = parseFloat(finalTarget);
    const score = parseFloat(predictedScore);

    if (isNaN(target) || isNaN(score)) return;

    const diff = score - target;

    if (diff >= 0) {
      setStatusColor('#22c55e'); // Green
      setStatusMessage('Excellent! On track.');
    } else if (diff >= -10) {
      setStatusColor('#eab308'); // Yellow
      setStatusMessage('Close! Needs a little push.');
    } else {
      setStatusColor('#ef4444'); // Red
      setStatusMessage('Action needed! Improve required.');
    }
  }, [finalTarget, predictedScore]);

  const addTest = () => {
    setTests([...tests, { name: `Test ${tests.length + 1}`, percentage: '' }]);
  };

  const updateTest = (index, value) => {
    const newTests = [...tests];
    newTests[index].percentage = value;
    setTests(newTests);
  };

  const removeTest = (index) => {
    const newTests = tests.filter((_, i) => i !== index);
    setTests(newTests);
  };

  return (
    <div className="glass-card">
      <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Module Name (e.g., Mathematics)"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '70%' }}
        />
        <button className="btn-danger" onClick={() => onDelete(id)} style={{ padding: '0.4rem 0.8rem' }}>
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1' }}>Assessments</h4>
        {tests.map((test, index) => (
          <div key={index} className="flex-row" style={{ marginBottom: '0.5rem' }}>
            <span style={{ minWidth: '60px', color: '#94a3b8' }}>{test.name}</span>
            <input
              type="number"
              placeholder="%"
              value={test.percentage}
              onChange={(e) => updateTest(index, e.target.value)}
              style={{ width: '80px' }}
            />
             {tests.length > 1 && (
                <button 
                    onClick={() => removeTest(index)}
                    style={{ background: 'transparent', color: '#ef4444', padding: '0 0.5rem', fontSize: '0.8rem', border: 'none' }}
                >
                    remove
                </button>
             )}
          </div>
        ))}
        <button className="btn-outline" onClick={addTest} style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          + Add Test
        </button>
      </div>

      <div className="grid-cols-2">
        <div>
          <label>Target %</label>
          <input
            type="number"
            placeholder="e.g. 75"
            value={finalTarget}
            onChange={(e) => setFinalTarget(e.target.value)}
          />
        </div>
        <div>
          <label>Predicted / Actual %</label>
          <input
            type="number"
            placeholder="e.g. 80"
            value={predictedScore}
            onChange={(e) => setPredictedScore(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex-row">
            <div className="indicator-dot" style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}` }}></div>
            <span style={{ fontWeight: '500', color: statusColor === 'gray' ? '#fff' : statusColor }}>
            {statusMessage}
            </span>
        </div>
        {/* Simple visual bar for score vs target */}
        {(finalTarget && predictedScore) && (
            <div style={{ position: 'relative', marginTop: '10px', height: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${Math.min(finalTarget, 100)}%`,
                    borderRight: '2px solid rgba(255,255,255,0.5)',
                    zIndex: 1
                }} title="Target" />
                <div style={{
                    width: `${Math.min(predictedScore, 100)}%`,
                    height: '100%',
                    background: statusColor,
                    opacity: 0.6,
                    transition: 'width 0.5s ease'
                }} />
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
