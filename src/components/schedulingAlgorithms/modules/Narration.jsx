import React, { useEffect, useRef } from 'react';
import './Algorithms.css';

function FCFSNarration({ logs = [], currentStep, totalSteps }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!logs || logs.length === 0) return null;

  return (
    <div className="fcfs-narration">
      <h3>🗣️ Narration</h3>
      <div className="step-indicator">
        {currentStep < totalSteps
          ? `Step ${currentStep + 1} of ${totalSteps}`
          : '✅ Simulation Complete'}
      </div>

      <div className="narration-log" ref={scrollRef}>
        {logs.map((entry, idx) => (
          <div key={idx} className="narration-line">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FCFSNarration;
