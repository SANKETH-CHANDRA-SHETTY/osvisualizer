// Refactored Round Robin Simulator with Corrected Lifecycle Logic
import React, { useState, useEffect, useRef } from 'react';
import Input from '../modules/Input'
import ControlPanel from '../modules/ControlPanel';
import ResultsTable from '../modules/ResultsTable';
import ProcessQueue from '../modules/ProcessQueue';
import Narration from '../modules/Narration';
import ProcessLifeCycle from './Round-RobinProcessLifeCycle';
import GanttChart from './Round-RobinGanttChart';
import '../modules/Algorithms.css';

function RoundRobin() {
    const [processes, setProcesses] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [ganttData, setGanttData] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [systemTime, setSystemTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(true);
    const [narrations, setNarrations] = useState([]);
    const [speed, setSpeed] = useState(1);
    const [timeQuantum, setTimeQuantum] = useState(2);

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

    const handleAddProcess = (proc) => setProcesses((prev) => [...prev, proc]);
    const handleDeleteProcess = (idx) => setProcesses((prev) => prev.filter((_, i) => i !== idx));

    const handleClearAll = () => {
        clearSimInterval();
        setProcesses([]);
        setScheduled([]);
        setGanttData([]);
        setCurrentStep(-1);
        setSystemTime(0);
        setRunning(false);
        setPaused(true);
        setNarrations([]);
    };

    const generateSchedule = () => {
        const sorted = processes.map((p, index) => ({
            ...p,
            index,
            remaining: p.burst,
        })).sort((a, b) => a.arrival - b.arrival);

        const result = [];
        const gantt = [];
        const queue = [];
        let time = 0;
        let completed = 0;
        let idx = 0;

        while (completed < sorted.length) {
            while (idx < sorted.length && sorted[idx].arrival <= time) {
                queue.push({ ...sorted[idx] });
                idx++;
            }

            if (queue.length === 0) {
                gantt.push({ name: 'Idle', start: time, end: time + 1 });
                time++;
                continue;
            }

            const current = queue.shift();
            const execTime = Math.min(timeQuantum, current.remaining);
            const start = time;
            const end = time + execTime;

            gantt.push({ name: current.name, start, end });
            time += execTime;
            current.remaining -= execTime;

            while (idx < sorted.length && sorted[idx].arrival <= time) {
                queue.push({ ...sorted[idx] });
                idx++;
            }

            if (current.remaining > 0) {
                queue.push(current);
            } else {
                const turnaroundTime = time - current.arrival;
                const waitingTime = turnaroundTime - current.burst;

                result.push({
                    name: current.name,
                    arrival: current.arrival,
                    burst: current.burst,
                    startTime: start,
                    completionTime: time,
                    turnaroundTime,
                    waitingTime,
                });

                completed++;
            }
        }

        result.sort((a, b) => a.name.localeCompare(b.name));
        return { result, gantt };
    };

    const simulateExecution = () => {
        clearSimInterval();
        let index = currentStep + 1;

        intervalRef.current = setInterval(() => {
            if (index >= ganttData.length) {
                clearSimInterval();
                setCurrentStep(ganttData.length - 1);
                setSystemTime(ganttData[ganttData.length - 1]?.end || 0);
                setRunning(false);
                setPaused(true);
                pushNarration("✅ All processes have completed execution.");
                return;
            }

            const proc = ganttData[index];
            setSystemTime(proc.end);
            setCurrentStep(index);
            if (proc.name === 'Idle') {
                pushNarration(
                    `💤 CPU Idle:\n` +
                    `🔹 No processes available from ${proc.start} to ${proc.end}.\n` +
                    `🕰 System waits for the next process arrival.`
                );
            } else {
                const duration = proc.end - proc.start;
                const remaining = processes.find(p => p.name === proc.name)?.burst ?? '?';
                pushNarration(
                    `📦 Step ${index + 1} of ${ganttData.length}:\n` +
                    `🔹 Process ${proc.name} started execution at time ${proc.start}.\n` +
                    `⚡ Will run for ${duration} unit(s) till ${proc.end}.\n` +
                    `🔍 SJF-Preemptive selects the job with shortest *remaining* time at every tick.\n` +
                    `⏱ Remaining Time: ${remaining > duration ? remaining - duration : 0} (after execution)\n` +
                    `📈 System Time: ${proc.start} → ${proc.end}`
                );
            }

            index++;
        }, 1000 / speed);
    };

    const handleStart = () => {
        if (processes.length === 0) return;
        const { result, gantt } = generateSchedule();
        setScheduled(result);
        setGanttData(gantt);
        setCurrentStep(-1);
        setSystemTime(gantt[0]?.start || 0);
        setRunning(true);
        setPaused(false);
        setNarrations(['🟢 Round-Robin Simulation started.']);
    };

    const handlePause = () => {
        if (!running) return;
        if (paused) {
            setPaused(false);
        } else {
            clearSimInterval();
            setPaused(true);
            pushNarration("⏸️ Simulation paused.");
        }
    };

    const handleStep = () => {
        if (!running || paused || currentStep >= ganttData.length - 1) return;
        const nextStep = currentStep + 1;
        const proc = ganttData[nextStep];
        setCurrentStep(nextStep);
        setSystemTime(proc.end);
        pushNarration(proc.name.toLowerCase() === 'idle'
            ? `💤 CPU Idle from ${proc.start} to ${proc.end}`
            : `🔁 Process ${proc.name} ran from ${proc.start} to ${proc.end}`);

        if (nextStep === ganttData.length - 1) {
            setRunning(false);
            setPaused(true);
            pushNarration("✅ All processes have completed execution.");
        }
    };

    const handleReset = () => {
        clearSimInterval();
        setScheduled([]);
        setGanttData([]);
        setCurrentStep(-1);
        setSystemTime(0);
        setRunning(false);
        setPaused(true);
        setNarrations(["🔁 Simulation reset."]);
    };

    useEffect(() => {
        if (running && !paused && ganttData.length > 0 && currentStep === -1) simulateExecution();
    }, [ganttData, running, paused]);

    useEffect(() => {
        if (running && !paused) simulateExecution();
        return clearSimInterval;
    }, [speed]);

    const computeLifecycle = (processes, ganttData, currentStep, systemTime) => {
        const seen = ganttData.slice(0, currentStep + 1);
        const lifecycle = { new: [], ready: [], running: [], terminated: [] };
        const executing = seen.length > 0 ? seen[seen.length - 1] : null;
        const executingName = executing?.name;

        const finishedMap = new Map();
        seen.forEach(({ name, end, start }) => {
            if (name !== 'Idle') {
                if (!finishedMap.has(name)) {
                    finishedMap.set(name, { time: 0, lastEnd: end });
                }
                const entry = finishedMap.get(name);
                entry.time += end - start;
                entry.lastEnd = end;
            }
        });

        processes.forEach((proc) => {
            const exec = finishedMap.get(proc.name);
            const executedTime = exec?.time || 0;
            const isRunning = executingName === proc.name;
            const isTerminated = executedTime >= proc.burst;
            const color = '';

            if (systemTime < proc.arrival) lifecycle.new.push({ ...proc, color });
            else if (isTerminated) lifecycle.terminated.push({ ...proc, terminationTime: exec?.lastEnd || 0 });
            else if (isRunning) lifecycle.running.push({ ...proc, color });
            else lifecycle.ready.push({ ...proc, color });
        });

        lifecycle.terminated.sort((a, b) => a.terminationTime - b.terminationTime);
        return lifecycle;
    };

    return (
        <div className="algorithm-container">
            <h2>🔄 Round-Robin Scheduling Simulator</h2>

            <section className="algorithm-section">
                <Input
                    processes={processes}
                    onAddProcess={handleAddProcess}
                    onDeleteProcess={handleDeleteProcess}
                    onClearAll={handleClearAll}
                />
                <label htmlFor="timeQuantum" style={{ color: 'black' }}>
                    ⏱️ Time Quantum:
                </label>

                <input
                    type="number"
                    id="timeQuantum"
                    min="1"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Number(e.target.value))}
                    style={{
                        width: '60px',
                        marginLeft: '10px',
                        color: 'black',
                        backgroundColor: 'white', // optional for visibility
                    }}
                />

            </section>

            <section className="algorithm-section">
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
            </section>

            <section className="algorithm-section">
                <ProcessLifeCycle
                    scheduled={computeLifecycle(processes, ganttData, currentStep, systemTime)}
                    ganttData={ganttData}
                    currentStep={currentStep}
                    systemTime={systemTime}
                />
            </section>

            <section className="algorithm-section">
                <GanttChart scheduled={ganttData.slice(0, currentStep + 1)} />
            </section>

            <section className="algorithm-section">
                <ProcessQueue scheduled={scheduled} currentStep={currentStep} systemTime={systemTime} />
            </section>

            <section className="algorithm-section">
                <Narration logs={narrations} currentStep={currentStep} totalSteps={ganttData.length} />
            </section>

            <section className="algorithm-section">
                <ResultsTable scheduled={scheduled} />
            </section>

            
        </div>
    );
}

export default RoundRobin;