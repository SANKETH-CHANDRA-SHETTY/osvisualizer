import React from 'react';
import ProcessForm from './ProcessForm';
import ProcessTable from './ProcessTable';
import './Algorithms.css';

function FCFSInput({ processes, onAddProcess, onDeleteProcess, onClearAll }) {
  return (
    <div className="fcfs-input-container">
      <h3>📥 Add New Process</h3>

      <ProcessForm processes={processes} onAddProcess={onAddProcess} />
      <ProcessTable
        processes={processes}
        onDeleteProcess={onDeleteProcess}
        onClearAll={onClearAll}
      />
    </div>
  );
}

export default FCFSInput;
