import React from 'react';
import './Algorithms.css';

function ProcessTable({ processes, onDeleteProcess, onClearAll }) {
  if (processes.length === 0) return null;

  return (
    <div className="process-table">
      <h4>📝 Current Processes</h4>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>AT</th>
            <th>BT</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((proc, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{proc.name}</td>
              <td>{proc.arrival}</td>
              <td>{proc.burst}</td>
              <td>
                <button onClick={() => onDeleteProcess(idx)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="clear-btn" onClick={onClearAll}>🗑️ Clear All</button>
    </div>
  );
}

export default ProcessTable;
