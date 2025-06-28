import React from 'react';
import './Algorithms.css';

function FCFSResultsTable({ scheduled }) {
  if (!scheduled || scheduled.length === 0) return null;

  // Sort by Arrival Time (AT) before rendering
  const sortedScheduled = [...scheduled].sort((a, b) => a.arrival - b.arrival);

  // Averages
  const totalWT = sortedScheduled.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTAT = sortedScheduled.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const avgWT = (totalWT / sortedScheduled.length).toFixed(2);
  const avgTAT = (totalTAT / sortedScheduled.length).toFixed(2);

  // Highlight shortest and longest WT
  const waitingTimes = sortedScheduled.map(p => p.waitingTime);
  const minWT = Math.min(...waitingTimes);
  const maxWT = Math.max(...waitingTimes);

  return (
    <div className="fcfs-results-table fade-in">
      <h3>📊 Results Table</h3>
      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>AT</th>
            <th>BT</th>
            <th>🟢 ST</th>
            <th title="CT = ST + BT">✅ CT</th>
            <th title="TAT = CT - AT">🔁 TAT</th>
            <th title="WT = TAT - BT">⏳ WT</th>
          </tr>
        </thead>
        <tbody>
          {sortedScheduled.map((proc, index) => {
            const rowClass =
              proc.waitingTime === minWT
                ? 'shortest-wt'
                : proc.waitingTime === maxWT
                ? 'longest-wt'
                : '';

            return (
              <tr key={index} className={rowClass}>
                <td>{proc.name}</td>
                <td>{proc.arrival}</td>
                <td>{proc.burst}</td>
                <td>{proc.startTime}</td>
                <td>{proc.completionTime}</td>
                <td>{proc.turnaroundTime}</td>
                <td>{proc.waitingTime}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5"><strong>Average</strong></td>
            <td>{avgTAT}</td>
            <td>{avgWT}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default FCFSResultsTable;
