import React, { useState, useEffect } from 'react';
import './Intro.css';

function TimeSharingOS() {
  const users = ['Student A', 'Student B', 'Student C'];
  const [currentUser, setCurrentUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3);
  const [showDrama, setShowDrama] = useState(false);
  const [osEnabled, setOsEnabled] = useState(false);
  const [log, setLog] = useState([]);
  const [cycle, setCycle] = useState(0);
  const [simulationDone, setSimulationDone] = useState(false);
  const [completedUsers, setCompletedUsers] = useState([]);

  useEffect(() => {
    if (!osEnabled || simulationDone) return;

    const userOrder = [0, 1, 2, 0, 1, 2];
    if (cycle >= userOrder.length) {
      setSimulationDone(true);
      setLog((prevLog) => [...prevLog, '✅ Final process completed. Simulation finished.']);
      return;
    }

    setCurrentUser(userOrder[cycle]);
    setLog((prevLog) => [...prevLog, `Switched to ${users[userOrder[cycle]]}`]);
    setTimeLeft(3);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(countdown);

          // Mark user as completed if it's their last turn
          if (
            (cycle === 3 && userOrder[cycle] === 0) ||
            (cycle === 4 && userOrder[cycle] === 1) ||
            (cycle === 5 && userOrder[cycle] === 2)
          ) {
            setCompletedUsers((prev) => [...prev, userOrder[cycle]]);
            setLog((prevLog) => [...prevLog, `${users[userOrder[cycle]]} has completed their task.`]);
          } else {
            setLog((prevLog) => [...prevLog, `${users[userOrder[cycle]]} timeslice ended.`]);
          }

          setCycle((prev) => prev + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [cycle, osEnabled, simulationDone]);

  const toggleDrama = () => setShowDrama(!showDrama);
  const toggleOS = () => {
    setOsEnabled(true);
    setLog(['🚀 Time-Sharing Simulation Started']);
    setCycle(0);
  };

  return (
    <div className="time-sharing-container">
      <h2>🧠 Time-Sharing Operating System</h2>

      <section className="ts-before-after">
        <h4>Why Time-Sharing is Needed</h4>
        <div className="comparison-row">
          <div className="compare-card">
            <h5>🚫 Without Time-Sharing</h5>
            <div className="cpu-box overused">🔥 CPU Overloaded by Student A</div>
            <div className="user-row">
              <div className="user-box sad">Student A 😅</div>
              <div className="user-box waiting">Student B 😠</div>
              <div className="user-box waiting">Student C 😢</div>
            </div>
            <p className="caption">One user hogs everything. Others wait endlessly.</p>
          </div>

          <div className="compare-card">
            <h5>✅ With Time-Sharing</h5>
            <div className="cpu-box shared">😎 CPU Shares Time</div>
            <div className="user-row">
              <div className="user-box happy">Student A 🙂</div>
              <div className="user-box happy">Student B 🙂</div>
              <div className="user-box happy">Student C 🙂</div>
            </div>
            <p className="caption">Everyone gets a fair chance! System is responsive.</p>
          </div>
        </div>
      </section>

      <section className="drama-mode">
        <h4>🎭 OS Drama Mode</h4>
        <button onClick={toggleDrama} className="drama-btn">{showDrama ? 'Hide Drama' : 'Show Drama Scene'}</button>
        {showDrama && (
          <div className="drama-scene">
            {!osEnabled ? (
              <>
                <p>😡 Student A: "It's my CPU!"</p>
                <p>😭 Student B: "Still waiting..."</p>
                <p>🔥 CPU: "Too hot! Overloaded!"</p>
                <button onClick={toggleOS} className="enable-btn">☑️ Enable Time-Sharing</button>
              </>
            ) : (
              <>
                <p>🙂 Student A: "Thanks, I got my turn!"</p>
                <p>🙂 Student B: "Finally some CPU time!"</p>
                <p>😎 CPU: "All cool. One at a time please..."</p>
              </>
            )}
          </div>
        )}
      </section>

      {osEnabled && (
        <section className="simulation-section">
          <h4>🔁 Live Simulation</h4>
          <div className="cpu-slice">⏱ CPU Slice: {timeLeft}s</div>
          <div className="user-area">
            {users.map((user, idx) => (
              <div
                key={user}
                className={`user-box ${currentUser === idx ? 'active' : ''} ${completedUsers.includes(idx) ? 'completed' : ''}`}
              >
                {user}<br />
                {completedUsers.includes(idx)
                  ? '✅ Completed'
                  : currentUser === idx
                  ? '💬 My turn!'
                  : 'Idle...'}
              </div>
            ))}
          </div>
          <div className="log-panel">
            <h5>📝 OS Log</h5>
            <ul>
              {log.map((entry, i) => <li key={i}>{entry}</li>)}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default TimeSharingOS;
