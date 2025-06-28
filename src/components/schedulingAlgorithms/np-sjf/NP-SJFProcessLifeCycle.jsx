import React from 'react';
import '../modules/Algorithms.css';

function ProcessLifeCycleVisualizer({ scheduled, systemTime }) {
  if (!scheduled || scheduled.length === 0) return null;

  const stages = {
    new: [],
    ready: [],
    running: [],
    terminated: []
  };

  scheduled.forEach((proc) => {
    if (systemTime < proc.arrival) {
      stages.new.push(proc);
    } else if (systemTime < proc.startTime) {
      stages.ready.push(proc);
    } else if (systemTime < proc.completionTime) {
      stages.running.push(proc);
    } else {
      stages.terminated.push(proc);
    }
  });

  const totalStages = ['new', 'ready', 'running', 'terminated'];

  return (
    <div className="lifecycle-visualizer">
      <h3>🧠 Process Lifecycle</h3>
      <div className="lifecycle-row">
        {totalStages.map((stageKey, idx) => (
          <React.Fragment key={stageKey}>
            <Stage
              title={stageTitles[stageKey]}
              processes={stages[stageKey]}
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
  terminated: '✅ Terminated'
};

const Stage = ({ title, processes, state }) => (
  <div className={`lifecycle-stage ${state}`}>
    <div className="stage-title">
      {title}
      <span className="count">({processes.length})</span>
    </div>
    {processes.length > 0 ? (
      processes.map((p, i) => (
        <div key={i} className={`process-box animate ${state}`}>
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
