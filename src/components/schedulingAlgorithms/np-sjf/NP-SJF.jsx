import React, { useState, useEffect, useRef } from 'react';
import Input from '../modules/Input'
import ControlPanel from '../modules/ControlPanel';
import ResultsTable from '../modules/ResultsTable';
import ProcessQueue from '../modules/ProcessQueue';
import Narration from '../modules/Narration';
import ProcessLifeCycle from './NP-SJFProcessLifeCycle';
import GanttChart from './NP-SJFGanttChart';
import '../modules/Algorithms.css';

function NPSJF() {
  const [processes, setProcesses] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [systemTime, setSystemTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(true);
  const [narrations, setNarrations] = useState([]);
  const [speed, setSpeed] = useState(1);

  const intervalRef = useRef(null);

  const clearSimInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pushNarration = (text) => {
    setNarrations((prev) => [...prev, text]);
  };

  const handleAddProcess = (proc) => {
    setProcesses((prev) => [...prev, proc]);
  };

  const handleDeleteProcess = (idx) => {
    setProcesses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearAll = () => {
    clearSimInterval();
    setProcesses([]);
    setScheduled([]);
    setCurrentStep(-1);
    setSystemTime(0);
    setRunning(false);
    setPaused(true);
    setNarrations([]);
  };

  const generateSchedule = () => {
    const sorted = [...processes];
    const result = [];
    const done = Array(sorted.length).fill(false);
    let time = 0;
    let completed = 0;

    while (completed < sorted.length) {
      let available = [];

      for (let i = 0; i < sorted.length; i++) {
        if (!done[i] && sorted[i].arrival <= time) {
          available.push({ ...sorted[i], index: i });
        }
      }

      if (available.length === 0) {
        for (let i = 0; i < sorted.length; i++) {
          if (!done[i]) {
            time = sorted[i].arrival;
            break;
          }
        }
        continue;
      }

      let shortest = available[0];
      for (let proc of available) {
        if (proc.burst < shortest.burst) {
          shortest = proc;
        }
      }

      const i = shortest.index;
      const start = time;
      const complete = time + shortest.burst;
      const tat = complete - shortest.arrival;
      const wt = tat - shortest.burst;
      const hue = (completed * 67) % 360;
      const color = `hsl(${hue}, 70%, 70%)`;

      result.push({
        ...shortest,
        startTime: start,
        completionTime: complete,
        turnaroundTime: tat,
        waitingTime: wt,
        color,
      });

      time = complete;
      done[i] = true;
      completed++;
    }

    return result;
  };

  const simulateExecution = () => {
    clearSimInterval();
    let tick = systemTime;
    let index = currentStep + 1;

    intervalRef.current = setInterval(() => {
      if (index >= scheduled.length) {
        clearSimInterval();
        setCurrentStep(scheduled.length); // mark all done
        setSystemTime((prev) => prev + 1);
        setRunning(false);
        setPaused(true);
        pushNarration("✅ All processes have completed execution. Simulation complete.");
        return;
      }

      const proc = scheduled[index];

      if (tick < proc.startTime) {
        setSystemTime(tick);
        tick++;
        return;
      }

      if (tick === proc.startTime) {
        const wait = proc.startTime - proc.arrival;
        pushNarration(
          `📦 Step ${index + 1} of ${scheduled.length}:\n` +
          `🔹 Process ${proc.name} started at time ${proc.startTime}.\n` +
          `📥 It arrived at ${proc.arrival}, waited ${wait} unit(s).\n` +
          `🔍 At time ${proc.startTime}, ${proc.name} had the shortest burst (${proc.burst}) among available processes.\n` +
          `⚙️ SJF-Non-Preemptive runs the shortest job fully without interruption.\n` +
          `🔚 It will complete at ${proc.completionTime}.`
        );
      }

      if (tick === proc.completionTime - 1) {
        setCurrentStep(index);
        index++;
      }

      setSystemTime(tick);
      tick++;
    }, 1000 / speed);
  };

  const handleStart = () => {
    if (processes.length === 0) return;

    const result = generateSchedule();
    setScheduled(result);
    setCurrentStep(-1);
    setSystemTime(result[0].startTime);
    setRunning(true);
    setPaused(false);
    setNarrations(["🟢 SJF-Non-Preemptive Simulation started. Process queue created."]);
  };

  const handlePause = () => {
    if (!running) return;

    if (paused) {
      setPaused(false);
      simulateExecution();
    } else {
      clearSimInterval();
      setPaused(true);
      pushNarration("⏸️ Simulation paused.");
    }
  };

  const handleStep = () => {
    if (!running || paused || currentStep >= scheduled.length - 1) return;

    const nextStep = currentStep + 1;
    const proc = scheduled[nextStep];
    setCurrentStep(nextStep);
    setSystemTime(proc.startTime);

    const wait = proc.startTime - proc.arrival;
    pushNarration(
      `⏱ Step ${nextStep + 1}:\n` +
      `🔹 Process ${proc.name} is now running.\n` +
      `📥 Arrival: ${proc.arrival}, Start: ${proc.startTime}, Wait: ${wait} unit(s).\n` +
      `🏁 Completion will be at ${proc.completionTime}.`
    );

    if (nextStep === scheduled.length - 1) {
      setRunning(false);
      setPaused(true);
      pushNarration("✅ All processes have completed execution. Simulation complete.");
    }
  };

  const handleReset = () => {
    clearSimInterval();
    setScheduled([]);
    setCurrentStep(-1);
    setSystemTime(0);
    setRunning(false);
    setPaused(true);
    setNarrations(["🔁 Simulation reset."]);
  };

  useEffect(() => {
    if (running && !paused && scheduled.length > 0 && currentStep === -1) {
      simulateExecution();
    }
  }, [scheduled, running, paused]);

  useEffect(() => {
    if (running && !paused) {
      simulateExecution();
    }
    return clearSimInterval;
  }, [speed]);

  return (
    <div className="algorithm-container">
      <h2>📊 SJF-Non-Preemptive Scheduling Simulator</h2>

      <Input
        processes={processes}
        onAddProcess={handleAddProcess}
        onDeleteProcess={handleDeleteProcess}
        onClearAll={handleClearAll}
      />

      <ControlPanel
        onStart={handleStart}
        onStep={handleStep}
        onPause={handlePause}
        onReset={handleReset}
        isRunning={running}
        isPaused={paused}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <GanttChart scheduled={scheduled.slice(0, currentStep + 1)} />

      <ProcessQueue
        scheduled={scheduled}
        currentStep={currentStep}
        systemTime={systemTime}
      />

      <Narration
        logs={narrations}
        currentStep={currentStep}
        totalSteps={scheduled.length}
      />

      <ResultsTable scheduled={scheduled} />

      <ProcessLifeCycle
        scheduled={scheduled}
        currentStep={currentStep}
        systemTime={systemTime}
      />
    </div>
  );
}

export default NPSJF;
