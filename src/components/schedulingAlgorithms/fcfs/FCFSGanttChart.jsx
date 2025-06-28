import React from 'react';
import '../modules/Algorithms.css';

function FCFSGanttChart({ scheduled }) {
  if (!scheduled || scheduled.length === 0) return null;

  const totalTime = scheduled[scheduled.length - 1].completionTime;

  // Generate consistent color from process name
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  };

  // Build timeline with idle times
  const timeline = [];
  let lastTime = 0;

  // Color map for legend
  const processColorMap = {};

  scheduled.forEach((proc) => {
    if (proc.startTime > lastTime) {
      timeline.push({
        name: 'Idle',
        startTime: lastTime,
        completionTime: proc.startTime,
        burst: proc.startTime - lastTime,
        isIdle: true,
      });
    }

    const colorUsed = proc.color || getColorFromName(proc.name);
    processColorMap[proc.name] = colorUsed;

    timeline.push({ ...proc, isIdle: false, finalColor: colorUsed });
    lastTime = proc.completionTime;
  });

  return (
    <div className="fcfs-gantt-chart">
      <h3>📈 Gantt Chart</h3>

      {/* Gantt Chart Bars */}
      <div className="gantt-bar-container">
        {timeline.map((proc, index) => {
          const widthPercent = ((proc.burst / totalTime) * 100).toFixed(2);
          const leftPercent = ((proc.startTime / totalTime) * 100).toFixed(2);

          const bgColor = proc.isIdle ? '#d1d5db' : proc.finalColor;

          const tooltipText = proc.isIdle
            ? `💤 CPU Idle: ${proc.startTime} → ${proc.completionTime}`
            : `🔄 ${proc.name}\nStart: ${proc.startTime}\nEnd: ${proc.completionTime}\nBT: ${proc.burst}`;

          return (
            <div
              key={index}
              className="gantt-bar"
              style={{
                width: `${widthPercent}%`,
                left: `${leftPercent}%`,
                backgroundColor: bgColor,
              }}
              title={tooltipText}
            >
              {!proc.isIdle && <span className="bar-label">{proc.name}</span>}
            </div>
          );
        })}
      </div>

      {/* Time Axis */}
      <div className="time-axis">
        {Array.from({ length: totalTime + 1 }, (_, i) => (
          <span key={i} className="time-tick">{i}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="gantt-legend">
        <h4 style={{color:'#000'}}>🗂️ Legend</h4>
        <div className="legend-items">
          {Object.entries(processColorMap).map(([name, color], index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color-box"
                style={{ backgroundColor: color }}
              ></span>
              <span className="legend-label">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FCFSGanttChart;
