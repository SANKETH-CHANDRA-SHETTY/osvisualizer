import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home.jsx';
import Intro from './components/intro/Intro.jsx';
import SchedulingAlgorithms from './components/schedulingAlgorithms/SchedulingAlgorithms.jsx';
import Memory from './components/memory/Memory.jsx'
import Deadlock  from './components/deadlock/Deadlock.jsx';
import File from './components/files/file.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/scheduling-algorithms" element={<SchedulingAlgorithms />} />
      <Route path="/memory" element={<Memory/>}/>
      <Route path="/deadlock" element={<Deadlock/>}/>
      <Route path="/file" element={<File/>}/>
    </Routes>
  );
}

export default App;
