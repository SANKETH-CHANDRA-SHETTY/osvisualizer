// SpeedSlider.jsx
import React from 'react';
import './Algorithms.css';

function SpeedSlider({ speed, onSpeedChange }) {
  return (
    <div className="speed-slider-container">
      <label htmlFor="speed-slider">⏱️ Simulation Speed</label>
      <input
        id="speed-slider"
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
      />
      <div className="speed-info">
        <span>1 sec = {speed} unit{speed !== 1 ? 's' : ''}</span>
        <span className={`speed-indicator ${speed > 1 ? 'fast' : speed < 1 ? 'slow' : 'normal'}`}>
          {speed > 1 ? '⚡ Fast' : speed < 1 ? '🐢 Slow' : '⏱️ Normal'}
        </span>
      </div>
    </div>
  );
}

export default SpeedSlider;
