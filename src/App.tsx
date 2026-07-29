import React from 'react';
import './App.css';
import { PageProvider, usePage, PAGE_LABELS, PageId } from './context/PageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import WorkLog from './components/WorkLog';

const PageShell: React.FC = () => {
  const { index } = usePage();

  const pages: { id: PageId; node: React.ReactNode }[] = [
    { id: 'hero', node: <Hero /> },
    { id: 'about', node: <About /> },
    { id: 'skills', node: <Skills /> },
    { id: 'education', node: <Education /> },
    { id: 'experience', node: <Experience /> },
    { id: 'projects', node: <Projects /> },
    { id: 'worklog', node: <WorkLog /> },
  ];

  return (
    <div className="App App--pages">
      <Navbar />
      <div className="page-viewport">
        <div
          className="page-track"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {pages.map(({ id, node }) => (
            <section key={id} className="page" data-page={id} aria-label={PAGE_LABELS[id]}>
              {node}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <PageProvider>
      <PageShell />
    </PageProvider>
  );
}

export default App;
