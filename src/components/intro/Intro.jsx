import React from 'react';
import OSDefinition from './OSDefinition.jsx';
import OSTypes from './OSTypes.jsx';

function Intro() {
  return (
    <div className="intro-container">
      <header className="intro-header">
        <h1>🧠 Introduction to Operating Systems</h1>
        <p>Explore how operating systems work, why they exist, and how they manage system resources.</p>
      </header>

      <section className="intro-section"><OSDefinition /></section>
      <section className="intro-section"><OSTypes /></section>
    </div>
  );
}

export default Intro;
