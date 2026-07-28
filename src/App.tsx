import React from 'react';
import './App.css';
import { PageProvider, usePage, PAGE_IDS, PAGE_LABELS, PageId } from './context/PageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import WorkLog from './components/WorkLog';

const PageIndicator: React.FC = () => {
  const { index, goTo, pageCount } = usePage();

  return (
    <nav className="page-dots" aria-label="페이지 탐색">
      {PAGE_IDS.map((id, i) => (
        <button
          key={id}
          type="button"
          className={`page-dots__dot${i === index ? ' page-dots__dot--active' : ''}`}
          onClick={() => goTo(id)}
          aria-label={PAGE_LABELS[id]}
          aria-current={i === index ? 'page' : undefined}
        />
      ))}
      <span className="page-dots__label" aria-hidden="true">
        {index + 1}/{pageCount}
      </span>
    </nav>
  );
};

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
      <PageIndicator />
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
