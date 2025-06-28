import React from 'react';
import '../modules/Algorithms.css';

function SJFPGanttChart({ scheduled }) {
  if (!scheduled || scheduled.length === 0) return null;

  // ✅ Hash to HSL color (exact same as FCFS)
  const getColorFromName = (() => {
  const usedHues = new Set();

  return (name) => {
    // Step 1: Get raw hash from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Step 2: Use golden ratio to spread hues
    const goldenRatio = 137.508; // good separation angle
    let hue = Math.abs(hash) % 360;

    // Step 3: Step hue by golden angle until unique enough
    while ([...usedHues].some(h => Math.abs(h - hue) < 25)) {
      hue = (hue + goldenRatio) % 360;
    }

    usedHues.add(hue);

    return `hsl(${hue.toFixed(0)}, 70%, 70%)`;
  };
})();


  const processColorMap = {};
  const timeline = [];
  let lastTime = 0;

  // ✅ Build timeline with color assignment and idle tracking
  scheduled.forEach((proc) => {
    const { name, start, end } = proc;

    // Insert idle if gap
    if (start > lastTime) {
      timeline.push({
        name: 'IDLE',
        startTime: lastTime,
        completionTime: start,
        burst: start - lastTime,
        isIdle: true,
        finalColor: '#d1d5db',
      });
    }

    // ✅ Assign color only once per name
    if (name !== 'IDLE' && !processColorMap[name]) {
      const assignedColor = getColorFromName(name);
      processColorMap[name] = assignedColor;
      console.log(`Assigned color to ${name}: ${assignedColor}`);
    }

    timeline.push({
      name,
      startTime: start,
      completionTime: end,
      burst: end - start,
      isIdle: name === 'IDLE',
      finalColor: name === 'IDLE' ? '#d1d5db' : processColorMap[name],
    });

    lastTime = end;
  });

  const totalTime = timeline[timeline.length - 1].completionTime;

  return (
    <div className="fcfs-gantt-chart">
      <h3>📈 Gantt Chart</h3>

      {/* Gantt Bars */}
      <div className="gantt-bar-container">
        {timeline.map((proc, index) => {
          const widthPercent = ((proc.burst / totalTime) * 100).toFixed(2);
          const leftPercent = ((proc.startTime / totalTime) * 100).toFixed(2);

          return (
            <div
              key={index}
              className="gantt-bar"
              style={{
                width: `${widthPercent}%`,
                left: `${leftPercent}%`,
                backgroundColor: proc.finalColor,
              }}
              title={
                proc.isIdle
                  ? `💤 IDLE: ${proc.startTime} → ${proc.completionTime}`
                  : `${proc.name}: ${proc.startTime} → ${proc.completionTime}`
              }
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

export default SJFPGanttChart;
