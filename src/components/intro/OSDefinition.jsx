import React, { useState } from 'react';
import './Intro.css';

function OSDefinition() {
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [osMode, setOsMode] = useState(null);

  return (
    <div className="osdef-container">
      {/* Title */}
      <header className="osdef-header">
        <h2>🧠 What is an Operating System?</h2>
        <p>
          An <strong>Operating System (OS)</strong> is a system software that manages hardware and software resources, 
          and provides essential services for application programs.
        </p>
        <p>
          It acts as a <strong>bridge between the user and hardware</strong>, enabling interaction and resource sharing.
        </p>
      </header>

      {/* Bridge Diagram */}
      <section className="osdef-bridge">
        <div className="bridge-row">
          <div className="bridge-box">👤 User</div>
          <div className="bridge-arrow">➡️</div>
          <div className="bridge-box">🖥️ OS</div>
          <div className="bridge-arrow">➡️</div>
          <div className="bridge-box">💽 Hardware</div>
        </div>
        <p className="bridge-caption">
          The OS connects users to hardware while managing processes and resources.
        </p>
      </section>

      {/* Responsibilities */}
      <section className="osdef-responsibilities">
        <h3>🔧 Key Responsibilities of an OS</h3>
        <div className="responsibility-grid">
          {[
            { icon: '🧠', title: 'Process Mgmt', desc: 'Handles scheduling, execution, and multitasking.' },
            { icon: '🧵', title: 'Memory Mgmt', desc: 'Allocates and deallocates memory safely and efficiently.' },
            { icon: '📁', title: 'File System', desc: 'Organizes files, directories, and storage access.' },
            { icon: '🔌', title: 'Device Mgmt', desc: 'Controls access to input/output devices.' },
            { icon: '🔐', title: 'Security', desc: 'Protects system from unauthorized access and errors.' }
          ].map((item, i) => (
            <div key={i} className="resp-card">
              <div className="resp-front">{item.icon} {item.title}</div>
              <div className="resp-back">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Real-world Analogy */}
      <section className="osdef-analogy">
        <h3 onClick={() => setShowAnalogy(!showAnalogy)} className="clickable-title">
          ✈️ Real-World Analogy: OS as an Air Traffic Controller
        </h3>
        {showAnalogy && (
          <div className="analogy-box">
            <p>👨‍✈️ Pilots (Applications) request permission to land (use CPU).</p>
            <p>🗼 Controller (OS) decides when and where to land.</p>
            <p>📋 Ensures smooth traffic and prevents collisions or delays.</p>
          </div>
        )}
      </section>

      {/* With vs Without OS */}
      <section className="osdef-comparison">
        <h3>⚖️ Why Do We Need an Operating System?</h3>
        <div className="mode-buttons">
          <button onClick={() => setOsMode('without')}>🚫 Without OS</button>
          <button onClick={() => setOsMode('with')}>✅ With OS</button>
        </div>

        {osMode && (
          <div className="comparison-panel">
            <h4>{osMode === 'without' ? 'Without OS: Chaos' : 'With OS: Organized Control'}</h4>
            <div className={`resource-bar ${osMode}`}>
              {osMode === 'without' ? (
                <>
                  <div className="chaos app-a">App A (Greedy)</div>
                  <div className="chaos app-b">App B (Starved)</div>
                  <div className="chaos lines" />
                </>
              ) : (
                <div className="fair">
                  <div className="fair-app">App A</div>
                  <div className="divider" />
                  <div className="fair-app">App B</div>
                </div>
              )}
            </div>
            <ul className="comparison-points">
              {osMode === 'without' ? (
                <>
                  <li>❌ No control over resource usage</li>
                  <li>⚠️ Risk of starvation, crashes, and conflicts</li>
                  <li>🧠 Each app handles its own memory — unsafe</li>
                </>
              ) : (
                <>
                  <li>✅ Fair resource allocation handled by OS</li>
                  <li>🔐 Safe multitasking and memory isolation</li>
                  <li>🧠 Apps can focus only on business logic</li>
                </>
              )}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default OSDefinition;
