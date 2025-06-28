import React, { useState, useEffect, useRef } from 'react';
import Input from '../modules/Input'
import ControlPanel from '../modules/ControlPanel';
import ResultsTable from '../modules/ResultsTable';
import ProcessQueue from '../modules/ProcessQueue';
import Narration from '../modules/Narration';
import ProcessLifeCycle from './FCFSProcessLifeCycle';
import GanttChart from './FCFSGanttChart';
import '../modules/Algorithms.css';

function FCFS() {
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

    const generateSchedule = () => {
        const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
        let time = 0;
        const result = [];

        sorted.forEach((proc, idx) => {
            if (time < proc.arrival) time = proc.arrival;
            const start = time;
            const complete = start + proc.burst;

            const hue = (idx * 67) % 360; // different hue per index
            const color = `hsl(${hue}, 70%, 70%)`;

            result.push({
                ...proc,
                startTime: start,
                completionTime: complete,
                turnaroundTime: complete - proc.arrival,
                waitingTime: start - proc.arrival,
                color,
            });

            time = complete;
        });

        return result;
    };

    const simulateExecution = () => {
        clearSimInterval();
        let tick = systemTime;
        let index = currentStep + 1;

        intervalRef.current = setInterval(() => {
            if (index >= scheduled.length) {
                clearSimInterval();
                setCurrentStep(scheduled.length); // simulation is over
                setSystemTime((prev) => prev + 1);
                setRunning(false);
                setPaused(true);
                pushNarration("✅ All processes have completed execution. No more processes in the queue.");
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
                    `🎬 Step ${index + 1} of ${scheduled.length}:\n` +
                    `🔹 Process ${proc.name} started execution at time ${proc.startTime}.\n` +
                    `📥 It arrived at time ${proc.arrival} and waited ${wait} unit(s) in the ready queue.\n` +
                    `🧠 FCFS (First-Come-First-Serve) always schedules the process that arrived first.\n` +
                    `🕒 It will run without interruption until it finishes at time ${proc.completionTime}.`
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
        setNarrations(["🟢 Simulation started. Process queue formed."]);
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
        if (!running || paused || currentStep >= scheduled.length - 1) return;

        const nextStep = currentStep + 1;
        const proc = scheduled[nextStep];
        const wait = proc.startTime - proc.arrival;

        setCurrentStep(nextStep);
        setSystemTime(proc.startTime);

        pushNarration(
            `⏱ Manual Step ${nextStep + 1} of ${scheduled.length}:\n` +
            `🔹 Process ${proc.name} is now running (started at ${proc.startTime}).\n` +
            `⏳ It waited ${wait} unit(s) in the ready queue.\n` +
            `⚙️ FCFS policy means the earliest arriving process runs first, without preemption.\n` +
            `🔚 It will complete at ${proc.completionTime}.`
        );

        if (nextStep === scheduled.length - 1) {
            setRunning(false);
            setPaused(true);
            pushNarration("✅ All processes have completed execution. Simulation is finished.");
        }
    };


    const handleReset = () => {
        clearSimInterval();
        setProcesses([]); // optional — if you want to preserve processes, remove this
        setScheduled([]);
        setCurrentStep(-1);
        setSystemTime(0);
        setRunning(false);
        setPaused(true);
        setNarrations(["🔁 Simulation reset."]);
    };

    const handleAddProcess = (proc) => setProcesses((prev) => [...prev, proc]);
    const handleDeleteProcess = (idx) => setProcesses((prev) => prev.filter((_, i) => i !== idx));
    const handleClearAll = () => {
        handleReset();
    };

    // Start simulation only after schedule is populated and it's the first time
    useEffect(() => {
        if (running && !paused && scheduled.length > 0 && currentStep === -1) {
            simulateExecution();
        }
    }, [scheduled, running, paused]);

    // If speed is changed while running
    useEffect(() => {
        if (running && !paused) {
            simulateExecution();
        }
        return clearSimInterval;
    }, [speed]);

    return (
        <div className="algorithm-container">
            <h2>🔃 FCFS Scheduling Simulator</h2>

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
                <GanttChart scheduled={scheduled.slice(0, currentStep + 1)} />
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
                    totalSteps={scheduled.length}
                />

            </section>

            <section className="algorithm-section">
                <ResultsTable scheduled={scheduled} />
            </section>

            <section className="algorithm-section">
                <ProcessLifeCycle
                    scheduled={scheduled}
                    currentStep={currentStep}
                    systemTime={systemTime}
                />
            </section>
        </div>
    );
}

export default FCFS;
