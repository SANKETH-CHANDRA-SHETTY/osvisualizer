import React from 'react';
import '../modules/Algorithms.css';

function ProcessLifeCycleVisualizer({ scheduled, ganttData, currentStep, systemTime }) {
  if (!scheduled || scheduled.length === 0 || currentStep === -1) return null;

  const seen = ganttData.slice(0, currentStep + 1); // till current time
  const states = {
    new: [],
    ready: [],
    running: [],
    terminated: []
  };

  // Count how many times each process has executed
  const execCounts = {};
  seen.forEach(({ name }) => {
    if (!execCounts[name]) execCounts[name] = 0;
    execCounts[name]++;
  });

  // Map current process (only one) from gantt
  const currentProc = seen[seen.length - 1]?.name;

  scheduled.forEach((proc) => {
    const { name, arrival, completionTime } = proc;

    if (systemTime < arrival) {
      states.new.push(proc);
    } else if (systemTime >= completionTime) {
      states.terminated.push(proc);
    } else if (name === currentProc && systemTime >= proc.startTime && systemTime < proc.completionTime) {
      states.running.push(proc);
    } else {
      states.ready.push(proc);
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
              processes={states[stageKey]}
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
