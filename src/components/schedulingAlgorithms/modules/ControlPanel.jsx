import React from 'react';
import './Algorithms.css';
import SpeedSlider from './SpeedSlider';

function FCFSControlPanel({
  onStart,
  onStep,
  onPause,
  onReset,
  isRunning,
  isPaused,
  speed,
  onSpeedChange,
  currentStep,
  systemTime
}) {
  const getStatus = () => {
    if (isRunning && !isPaused) return { label: '🟢 Running', className: 'running' };
    if (isRunning && isPaused) return { label: '⏸️ Paused', className: 'paused' };
    if (!isRunning && currentStep > 0) return { label: '✅ Completed', className: 'completed' };
    return { label: '🔴 Not Started', className: 'idle' };
  };

  const status = getStatus();

  return (
    <div className="fcfs-control-panel">
      <div className="panel-header">
        <h3>🎛️ Simulation Controls</h3>
        <span className={`status-label ${status.className}`}>{status.label}</span>
      </div>

      <div className="control-buttons">
        <button title="Start the simulation" onClick={onStart} disabled={isRunning && !isPaused}>
          ▶️ Start
        </button>
        <button title="Manually move to the next process" onClick={onStep} disabled={!isRunning || !isPaused}>
          ⏩ Step
        </button>
        <button title="Pause or resume the simulation" onClick={onPause} disabled={!isRunning}>
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button title="Reset the simulation and data" onClick={onReset}>
          🔄 Reset
        </button>
      </div>

      <div className="speed-info">
        ⚡ Speed: <span>{speed.toFixed(1)}x</span>
      </div>

      <SpeedSlider speed={speed} onSpeedChange={onSpeedChange} />

      {/* Debug section - optional */}
      {/* 
      <div className="debug-panel">
        <p>🧪 <strong>Debug Info:</strong></p>
        <p>Current Step: {currentStep}</p>
        <p>System Time: {systemTime}</p>
        <p>Running: {String(isRunning)}</p>
        <p>Paused: {String(isPaused)}</p>
      </div>
      */}
    </div>
  );
}

export default FCFSControlPanel;
