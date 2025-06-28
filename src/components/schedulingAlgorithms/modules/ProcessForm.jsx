import React, { useState } from 'react';
import './Algorithms.css';

function ProcessForm({ processes, onAddProcess }) {
  const [form, setForm] = useState({ name: '', arrival: '', burst: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAdd = () => {
    const { name, arrival, burst } = form;

    if (name.trim() === '' || arrival === '' || burst === '') {
      setError('❗ Please fill all fields.');
      return;
    }

    const arrivalInt = parseInt(arrival);
    const burstInt = parseInt(burst);

    if (isNaN(arrivalInt) || isNaN(burstInt)) {
      setError('❌ Arrival and Burst must be numbers.');
      return;
    }

    if (arrivalInt < 0 || burstInt <= 0) {
      setError('❌ Arrival must be ≥ 0 and Burst must be > 0.');
      return;
    }

    // ✅ No more ordering check needed

    onAddProcess({
      name: name.trim(),
      arrival: arrivalInt,
      burst: burstInt,
    });

    setForm({ name: '', arrival: '', burst: '' });
  };


  const examples = [
    [ // Simple
      { name: 'P1', arrival: 0, burst: 3 },
      { name: 'P2', arrival: 1, burst: 5 },
      { name: 'P3', arrival: 2, burst: 2 },
    ],
    [ // Late arriving bursty process
      { name: 'P1', arrival: 0, burst: 2 },
      { name: 'P2', arrival: 1, burst: 2 },
      { name: 'P3', arrival: 2, burst: 10 },
    ],
    [ // All same arrival
      { name: 'P1', arrival: 0, burst: 5 },
      { name: 'P2', arrival: 0, burst: 3 },
      { name: 'P3', arrival: 0, burst: 7 },
    ],
    [ // Edge case with burst = 1
      { name: 'P1', arrival: 0, burst: 1 },
      { name: 'P2', arrival: 1, burst: 1 },
      { name: 'P3', arrival: 2, burst: 1 },
    ],
    [ // Increasing burst
      { name: 'P1', arrival: 0, burst: 1 },
      { name: 'P2', arrival: 1, burst: 2 },
      { name: 'P3', arrival: 2, burst: 3 },
      { name: 'P4', arrival: 3, burst: 4 },
    ],
    [ // 5 processes, mix
      { name: 'P1', arrival: 0, burst: 6 },
      { name: 'P2', arrival: 1, burst: 3 },
      { name: 'P3', arrival: 4, burst: 2 },
      { name: 'P4', arrival: 5, burst: 1 },
      { name: 'P5', arrival: 6, burst: 8 },
    ],
    [ // Gaps in arrival
      { name: 'P1', arrival: 0, burst: 2 },
      { name: 'P2', arrival: 4, burst: 4 },
      { name: 'P3', arrival: 10, burst: 1 },
    ],
    [ // Realistic pattern
      { name: 'Login', arrival: 0, burst: 2 },
      { name: 'DashboardLoad', arrival: 1, burst: 3 },
      { name: 'DBQuery', arrival: 2, burst: 4 },
    ],
    [ // Long process at end
      { name: 'ShortJob1', arrival: 0, burst: 2 },
      { name: 'ShortJob2', arrival: 1, burst: 1 },
      { name: 'HeavyJob', arrival: 2, burst: 10 },
    ],
    [ // Many processes
      { name: 'P1', arrival: 0, burst: 2 },
      { name: 'P2', arrival: 1, burst: 2 },
      { name: 'P3', arrival: 2, burst: 2 },
      { name: 'P4', arrival: 3, burst: 2 },
      { name: 'P5', arrival: 4, burst: 2 },
      { name: 'P6', arrival: 5, burst: 2 },
    ],
    [ // Many processes
      { name: 'P1', arrival: 0, burst: 5 },
      { name: 'P2', arrival: 2, burst: 3 },
      { name: 'P3', arrival: 2, burst: 8 },
      { name: 'P4', arrival: 5, burst: 6 },
      { name: 'P5', arrival: 9, burst: 2 },
      { name: 'P6', arrival: 12, burst: 4 },
    ],
    [ // Many processes
      { name: 'P1', arrival: 0, burst: 4 },
      { name: 'P2', arrival: 2, burst: 1 },
      { name: 'P3', arrival: 3, burst: 6 },
      { name: 'P4', arrival: 3, burst: 2 },
      { name: 'P5', arrival: 10, burst: 1 },
      { name: 'P6', arrival: 11, burst: 8 },
      { name: 'P7', arrival: 11, burst: 3 },
      { name: 'P8', arrival: 13, burst: 9 },
      { name: 'P9', arrival: 13, burst: 1 },
      { name: 'P10', arrival: 20, burst: 5 },
    ],
    [ // Many processes
      { name: 'P1', arrival: 0, burst: 6 },
      { name: 'P2', arrival: 2, burst: 4 },
      { name: 'P3', arrival: 3, burst: 2 },
      { name: 'P4', arrival: 5, burst: 4 },
      { name: 'P5', arrival: 7, burst: 3 },
      { name: 'P6', arrival: 10, burst: 5 },
      { name: 'P7', arrival: 10, burst: 1 },
      { name: 'P8', arrival: 12, burst: 7 },
      { name: 'P9', arrival: 12, burst: 1 },
      { name: 'P10', arrival: 14, burst: 3 },
    ],
    [ // Many processes
      { name: 'P1', arrival: 0, burst: 8 },
      { name: 'P2', arrival: 1, burst: 4 },
      { name: 'P3', arrival: 2, burst: 9 },
      { name: 'P4', arrival: 3, burst: 5 },
      { name: 'P5', arrival: 10, burst: 2 },
      { name: 'P6', arrival: 12, burst: 6 },
      { name: 'P7', arrival: 12, burst: 1 },
      { name: 'P8', arrival: 14, burst: 3 },
      { name: 'P9', arrival: 15, burst: 4 },
      { name: 'P10', arrival: 16, burst: 7 },
    ],
  ];

  const generateRandomExample = () => {
    const random = examples[Math.floor(Math.random() * examples.length)];
    random.forEach((proc, index) => {
      setTimeout(() => {
        onAddProcess(proc);
      }, index * 200);
    });
  };

  return (
    <>
      <div className="input-row">
        <input
          name="name"
          placeholder="Name (e.g. Task1)"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="arrival"
          type="number"
          placeholder="Arrival Time"
          value={form.arrival}
          onChange={handleChange}
        />
        <input
          name="burst"
          type="number"
          placeholder="Burst Time"
          value={form.burst}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>➕ Add</button>
        <button className="random-btn" onClick={generateRandomExample}>
          🎲 Random Example
        </button>
      </div>
      {error && <div className="warning-text">{error}</div>}
    </>
  );
}

export default ProcessForm;
