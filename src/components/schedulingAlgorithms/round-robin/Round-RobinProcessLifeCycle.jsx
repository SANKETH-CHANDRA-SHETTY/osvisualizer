import React from 'react';
import '../modules/Algorithms.css';

function ProcessLifeCycleVisualizer({ scheduled, ganttData, currentStep, systemTime }) {
  if (!scheduled || currentStep === -1) return null;

  const totalStages = ['new', 'ready', 'running', 'terminated'];

  return (
    <div className="lifecycle-visualizer">
      <h3>🧠 Process Lifecycle</h3>
      <div className="lifecycle-row">
        {totalStages.map((stageKey, idx) => (
          <React.Fragment key={stageKey}>
            <Stage
              title={stageTitles[stageKey]}
              processes={scheduled[stageKey] || []}
              state={stageKey}
            />
            {idx < totalStages.length - 1 && <Arrow />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const stageTitles = {
  new: '🕒 New',
  ready: '⏳ Ready',
  running: '🔄 Running',
  terminated: '✅ Terminated',
};

const Stage = ({ title, processes, state }) => (
  <div className={`lifecycle-stage ${state}`}>
    <div className="stage-title">
      {title}
      <span className="count">({processes.length})</span>
    </div>
    {processes.length > 0 ? (
      processes.map((p, i) => (
        <div
          key={i}
          className={`process-box animate ${state}`}
          style={{ backgroundColor: p.color }}
        >
          {p.name}
        </div>
      ))
    ) : (
      <div className="no-process">—</div>
    )}
  </div>
);

const Arrow = () => <div className="lifecycle-arrow">→</div>;

export default ProcessLifeCycleVisualizer;
