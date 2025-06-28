import React, { useState, useEffect } from 'react';
import './Intro.css';
import TimeSharingOS from './TimeSharingOS.jsx';
import SingleProcessOS from './SingleProcessOS.jsx';

function OSTypesSimulation() {
  const [activeApp, setActiveApp] = useState(null);
  const [batchJobs, setBatchJobs] = useState([
    { name: 'Print', status: 'queued' },
    { name: 'Compile', status: 'queued' },
    { name: 'Backup', status: 'queued' }
  ]);
  const [currentUser, setCurrentUser] = useState(0);
  const [realTimeStatus, setRealTimeStatus] = useState('waiting');
  const [distributedSteps, setDistributedSteps] = useState([]);
  const [multiProcs, setMultiProcs] = useState(['App1', 'App2', 'App3']);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleAppClick = (appName) => {
    if (!activeApp) setActiveApp(appName);
  };

  const closeApp = () => setActiveApp(null);

  const startBatch = () => {
    const updatedJobs = [...batchJobs];
    let index = 0;
    const processJob = () => {
      if (index >= updatedJobs.length) return;
      updatedJobs[index].status = 'processing';
      setBatchJobs([...updatedJobs]);
      setTimeout(() => {
        updatedJobs[index].status = 'done';
        setBatchJobs([...updatedJobs]);
        index++;
        processJob();
      }, 1000);
    };
    processJob();
  };

  const startRealTimeTask = () => {
    setRealTimeStatus('processing');
    setTimeout(() => {
      setRealTimeStatus(Math.random() > 0.3 ? 'done' : 'failed');
    }, 2000);
  };

  const startDistributedTask = () => {
    const steps = ['Split Task', 'Send to Node A', 'Send to Node B', 'Combine Results'];
    let idx = 0;
    setDistributedSteps([]);
    const run = () => {
      if (idx >= steps.length) return;
      setDistributedSteps(prev => [...prev, steps[idx]]);
      idx++;
      setTimeout(run, 1000);
    };
    run();
  };

  return (
    <div className="os-types-container">
      <h2>🧩 OS Types Simulations</h2>

      <SingleProcessOS/>

      <section>
        <h3>2. Batch OS</h3>
        <button className="app-button" onClick={startBatch}>Submit Batch</button>
        <div className="batch-area">
          {batchJobs.map((job, i) => (
            <div key={i} className={`job-card ${job.status}`}>
              {job.name}<br /><small>({job.status})</small>
            </div>
          ))}
        </div>
      </section>

      <TimeSharingOS/>

      <section>
        <h3>4. Real-Time OS</h3>
        <button className="app-button" onClick={startRealTimeTask}>Run Sensor Read</button>
        <div className={`realtime-box ${realTimeStatus}`}>
          {realTimeStatus === 'waiting' && 'Waiting for trigger...'}
          {realTimeStatus === 'processing' && '🔄 Reading sensor...'}
          {realTimeStatus === 'done' && '✅ Sensor read in time!'}
          {realTimeStatus === 'failed' && '❌ Deadline missed!'}
        </div>
      </section>

      <section>
        <h3>5. Distributed OS</h3>
        <button className="app-button" onClick={startDistributedTask}>Start Distributed Task</button>
        <div className="distributed-steps">
          {distributedSteps.map((step, i) => (
            <div key={i} className="dist-step">🔁 {step}</div>
          ))}
        </div>
      </section>

      <section>
        <h3>6. Multiprogramming OS</h3>
        <div className="multi-procs">
          {multiProcs.map((proc, i) => (
            <div key={i} className="proc-block">🧱 {proc}</div>
          ))}
        </div>
        <div className="shared-cpu">⚙️ Shared CPU executing in sequence...</div>
      </section>
    </div>
  );
}

export default OSTypesSimulation;
