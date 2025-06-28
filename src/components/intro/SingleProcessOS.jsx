import React, { useState, useEffect } from 'react';
import './Intro.css';

function SingleProcessOS() {
  const tasks = [
    { name: '🧠 Large App', duration: 6 },
    { name: '📝 Small App', duration: 2 },
    { name: '🎨 Medium App', duration: 4 }
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [log, setLog] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [simulationStarted, setSimulationStarted] = useState(false);

  useEffect(() => {
    if (!simulationStarted || currentTaskIndex === null) return;

    if (timeLeft === 0) {
      setLog(prev => [...prev, `✅ ${tasks[currentTaskIndex].name} completed.`]);
      setCompletedTasks(prev => [...prev, currentTaskIndex]);
      const nextIndex = currentTaskIndex + 1;
      if (nextIndex < tasks.length) {
        setCurrentTaskIndex(nextIndex);
        setTimeLeft(tasks[nextIndex].duration);
        setLog(prev => [...prev, `▶️ Starting ${tasks[nextIndex].name} (${tasks[nextIndex].duration}s)`]);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentTaskIndex, simulationStarted]);

  const startSimulation = () => {
    setSimulationStarted(true);
    setLog([`🚀 Starting Single Process Simulation`]);
    setCurrentTaskIndex(0);
    setTimeLeft(tasks[0].duration);
    setCompletedTasks([]);
  };

  return (
    <div className="single-process-container">
      <h2>🧠 Single Process Operating System</h2>

      <section className="concept-section">
        <div className="compare-card">
          <h4>🚫 Without Multi-tasking</h4>
          <p>Only one app can run at a time. Others must wait — no matter how small or urgent.</p>
          <div className="task-queue">
            {tasks.map((task, i) => (
              <div key={i} className={`task-box ${currentTaskIndex === i ? 'running' : completedTasks.includes(i) ? 'done' : 'waiting'}`}>
                {task.name}<br />
                {completedTasks.includes(i)
                  ? '✅ Done'
                  : currentTaskIndex === i
                  ? `⏱ Running (${timeLeft}s)`
                  : '⏳ Waiting'}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="drama-mode">
        <h4>🎭 Real-World Analogy</h4>
        <div className="drama-scene">
          <p>👩‍💻 One processor, one task!</p>
          <p>😓 Small App: "Why must I wait for that big guy to finish?!"</p>
          <p>😤 Medium App: "Even if I need just 4s, I can't jump in."</p>
          <p>🧠 CPU: "No multitasking here!"</p>
        </div>
      </section>

      <section className="simulation-section">
        <h4>🔁 Live Execution</h4>
        {!simulationStarted ? (
          <button className="start-btn" onClick={startSimulation}>▶️ Start Simulation</button>
        ) : (
          <>
            <div className="log-panel">
              <h5>📋 Process Log</h5>
              <ul>
                {log.map((entry, i) => <li key={i}>{entry}</li>)}
              </ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SingleProcessOS;
