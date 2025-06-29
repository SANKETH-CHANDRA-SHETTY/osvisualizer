import React, { useState, useEffect, useRef } from 'react';
import Input from '../modules/Input'
import ControlPanel from '../modules/ControlPanel';
import ResultsTable from '../modules/ResultsTable';
import ProcessQueue from '../modules/ProcessQueue';
import Narration from '../modules/Narration';
import ProcessLifeCycle from './P-SJFProcessLifeCycle';
import GanttChart from './P-SJFGanttChart';
import '../modules/Algorithms.css';

function PSJF() {
    const [processes, setProcesses] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [ganttData, setGanttData] = useState([]);
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
            executed: [],
        }));

        const n = sorted.length;
        const result = [];
        const gantt = [];
        let time = 0;
        let completedCount = 0;

        while (completedCount < n) {
            const available = sorted.filter(p => p.arrival <= time && p.remaining > 0);

            if (available.length === 0) {
                if (gantt.length && gantt[gantt.length - 1].name === 'Idle') {
                    gantt[gantt.length - 1].end++;
                } else {
                    gantt.push({ name: 'Idle', start: time, end: time + 1 });
                }
                time++;
                continue;
            }

            const next = available.reduce((a, b) => a.remaining < b.remaining ? a : b);

            if (gantt.length === 0 || gantt[gantt.length - 1].name !== next.name) {
                gantt.push({ name: next.name, start: time, end: time + 1 });
            } else {
                gantt[gantt.length - 1].end++;
            }

            next.executed.push(time);
            next.remaining--;
            time++;

            if (next.remaining === 0) {
                const completionTime = time;
                const startTime = next.executed[0];
                const turnaroundTime = completionTime - next.arrival;
                const waitingTime = turnaroundTime - next.burst;
                const hue = (completedCount * 67) % 360;
                const color = `hsl(${hue}, 70%, 70%)`;

                result.push({
                    name: next.name,
                    arrival: next.arrival,
                    burst: next.burst,
                    startTime,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                    color,
                });

                completedCount++;
            }
        }

        return { result, gantt };
    };

    const simulateExecution = () => {
        clearSimInterval();
        let tick = systemTime;
        let index = currentStep + 1;

        intervalRef.current = setInterval(() => {
            if (index >= ganttData.length) {
                clearSimInterval();
                setCurrentStep(ganttData.length - 1);
                setSystemTime(ganttData[ganttData.length - 1].end);
                setRunning(false);
                setPaused(true);
                pushNarration("✅ All processes have completed execution. No more processes in the queue.");
                return;
            }


            const proc = ganttData[index];
            setCurrentStep(index);
            setSystemTime(proc.start);

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
        setNarrations(["🟢 SJF-Preemptive Simulation started."]);
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
        if (!running || paused || currentStep >= ganttData.length - 1) return;

        const nextStep = currentStep + 1;
        const proc = ganttData[nextStep];
        setCurrentStep(nextStep);
        setSystemTime(proc.start);

        if (proc.name === 'Idle') {
            pushNarration(`💤 CPU was idle from ${proc.start} to ${proc.end}`);
        } else {
            pushNarration(`🔹 Process ${proc.name} executed from ${proc.start} to ${proc.end}`);
        }

        if (nextStep === ganttData.length - 1) {
            setRunning(false);
            setPaused(true);
            pushNarration("✅ All processes have completed execution. Simulation is finished.");
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
        if (running && !paused && ganttData.length > 0 && currentStep === -1) {
            simulateExecution();
        }
    }, [ganttData, running, paused]);

    useEffect(() => {
        if (running && !paused) {
            simulateExecution();
        }
        return clearSimInterval;
    }, [speed]);

    return (
        <div className="algorithm-container">
            <h2>⚡ SJF-Preemptive Scheduling Simulator</h2>

            <section className="algorithm-section">
                <Input
                    processes={processes}
                    onAddProcess={handleAddProcess}
                    onDeleteProcess={handleDeleteProcess}
                    onClearAll={handleClearAll}
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
                    scheduled={scheduled}
                    ganttData={ganttData}
                    currentStep={currentStep}
                    systemTime={systemTime}
                />

            </section>

            <section className="algorithm-section">
                <GanttChart scheduled={ganttData.slice(0, currentStep + 1)} />
            </section>

            <section className="algorithm-section">
                <ProcessQueue
                    scheduled={scheduled}
                    currentStep={currentStep}
                    systemTime={systemTime}
                />
            </section>

            <section className="algorithm-section">
                <Narration
                    logs={narrations}
                    currentStep={currentStep}
                    totalSteps={ganttData.length}
                />
            </section>

            <section className="algorithm-section">
                <ResultsTable scheduled={scheduled} />
            </section>

            
        </div>
    );
}

export default PSJF;