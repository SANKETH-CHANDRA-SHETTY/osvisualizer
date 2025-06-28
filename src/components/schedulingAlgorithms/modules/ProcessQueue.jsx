import React from 'react';
import './Algorithms.css';

function ProcessQueueVisualizer({ scheduled, systemTime }) {
  if (!scheduled || scheduled.length === 0) return null;

  const getTooltip = (proc) =>
    `AT: ${proc.arrival}, BT: ${proc.burst}, Starts: ${proc.startTime}`;

  let runningProc = scheduled.find(
    (p) => systemTime >= p.startTime && systemTime < p.completionTime
  );

  const lastCompletion = scheduled[scheduled.length - 1]?.completionTime ?? Infinity;

  // ✅ Ensure no process is shown as Running after all are done
  if (systemTime >= lastCompletion) {
    runningProc = null;
  }

  const queueProcs = scheduled.filter(
    (p) =>
      (p.arrival <= systemTime && systemTime < p.startTime) ||
      (systemTime >= p.startTime && systemTime < p.completionTime && p !== runningProc)
  );

  const doneProcs = scheduled.filter((p) => systemTime >= p.completionTime);

  const whyThisProcess = runningProc
    ? `📌 Picked ${runningProc.name} because it arrived earliest (AT: ${runningProc.arrival})`
    : '';

  return (
    <div className="process-queue-visualizer">
      <h3>📦 Ready Queue (Time: {systemTime})</h3>
      {whyThisProcess && <div className="cpu-decision-box">🧠 {whyThisProcess}</div>}

      <div className="queue-scroll">
        {runningProc && (
          <div
            className="process-block running animate"
            title={getTooltip(runningProc)}
          >
            🔄 {runningProc.name}
            <span className="label">Running</span>
          </div>
        )}

        {queueProcs.map((proc, index) => (
          <div
            key={index}
            className="process-block waiting"
            title={getTooltip(proc)}
          >
            ⏳ {proc.name}
            <span className="label">Waiting</span>
          </div>
        ))}

        {doneProcs.length === scheduled.length && (
          <div className="process-block done">✅ All processes executed</div>
        )}
      </div>
    </div>
  );
}

export default ProcessQueueVisualizer;
