import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // Optional: fade-in animation
  useEffect(() => {
    const cards = document.querySelectorAll(".module-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("fade-in-up");
    });
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🖥️ OS Concepts Visual Lab</h1>
        <p>Visualize and interact with key Operating System concepts</p>
      </header>

      <section className="home-modules">
        <h2>🧩 Explore Modules</h2>
        <div className="module-grid">
          <div className="module-card" onClick={() => navigate("/intro")}>
            <h3>🧠 Intro to OS</h3>
            <p>Understand boot process, components, and system calls</p>
          </div>

          <div className="module-card" onClick={() => navigate("/scheduling-algorithms")}>
            <h3>⚙️ Process Scheduling</h3>
            <p>Simulate FCFS, SJF, and Round Robin algorithms</p>
          </div>

          <div className="module-card" onClick={() => navigate("/memory")}>
            <h3>🧬 Memory Management</h3>
            <p>Explore paging, segmentation, and allocation</p>
          </div>

          <div className="module-card" onClick={() => navigate("/deadlock")}>
            <h3>🔒 Deadlock Handling</h3>
            <p>Visualize RAGs and Banker's algorithm</p>
          </div>

          <div className="module-card" onClick={() => navigate("/file")}>
            <h3>📁 File Systems</h3>
            <p>Simulate directory structures and allocation methods</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} OS Visualizer Project. Built by Sanketh.</p>
        <p><a href="https://github.com/SANKETH-CHANDRA-SHETTY/osvisualizer" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
      </footer>
    </div>
  );
}

export default Home;
