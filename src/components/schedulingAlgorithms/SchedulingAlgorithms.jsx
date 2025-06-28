import React, { useState } from 'react';
import './SchedulingAlgorithms.css';
import FCFS from './fcfs/FCFS.jsx';
import SJFNP from './np-sjf/NP-SJF.jsx';
import SJFP from './p-sjf/P-SJF.jsx';
import RoundRobin from './round-robin/Round-Robin.jsx';

const algorithmData = [
  {
    id: 'fcfs',
    title: '🔃 FCFS - First Come First Serve',
    description: 'Simplest scheduling algorithm. Executes processes in the order they arrive. Great for learning basics.',
    component: <FCFS />,
  },
  {
    id: 'sjfnp',
    title: '⏱️ SJF - Shortest Job First (Non-Preemptive)',
    description: 'Executes the process with the shortest burst time. Saves time but may starve long processes.',
    component: <SJFNP />,
  },
  {
    id: 'sjfp',
    title: '⚡ SJF - Shortest Job First (Preemptive)',
    description: 'Also called Shortest Remaining Time First. Newer, shorter jobs can interrupt running ones.',
    component: <SJFP />,
  },
  {
    id: 'rr',
    title: '🔁 Round Robin',
    description: 'Time-sharing scheduling where each process gets a small fixed time to execute (quantum).',
    component: <RoundRobin />,
  },
];

function SchedulingAlgorithms() {
  const [activeSimulations, setActiveSimulations] = useState({});

  const toggleSimulation = (id) => {
    setActiveSimulations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="program-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>🧠 CPU Scheduling Algorithms</h1>
        <p>
          CPU scheduling determines the order in which processes run on a CPU. It helps optimize resource use,
          reduce waiting time, and ensure fairness. Below are common algorithms used in Operating Systems.
        </p>
      </section>

      {/* Algorithm Cards */}
      <section className="algorithms-section">
        {algorithmData.map((algo) => (
          <div key={algo.id} className="algorithm-card">
            <h2>{algo.title}</h2>
            <p className="algo-description">{algo.description}</p>
            <button
              className="simulate-btn"
              onClick={() => toggleSimulation(algo.id)}
            >
              {activeSimulations[algo.id] ? '🔽 Hide Simulation' : '▶️ Simulate'}
            </button>
            {activeSimulations[algo.id] && (
              <div className="simulation-section">{algo.component}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default SchedulingAlgorithms;
