import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePage, PAGE_LABELS, PageId } from '../context/PageContext';

const BURST_MS = 900;

const BurstFx: React.FC = () => (
  <>
    <span className="navbar__burst-ring" aria-hidden="true" />
    <span className="navbar__burst-spark" aria-hidden="true" />
  </>
);

const SunIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const navItems: { label: string; to: PageId }[] = [
  { label: 'About', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Education', to: 'education' },
  { label: 'Experience', to: 'experience' },
  { label: 'Projects', to: 'projects' },
  { label: 'Work Log', to: 'worklog' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { pageId, index, goTo } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [burstKey, setBurstKey] = useState<string | null>(null);
  const burstTimer = useRef<number | null>(null);
  const elevated = index > 0;

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  const triggerBurst = useCallback((key: string) => {
    if (burstTimer.current) window.clearTimeout(burstTimer.current);
    setBurstKey(key);
    burstTimer.current = window.setTimeout(() => setBurstKey(null), BURST_MS);
  }, []);

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      triggerBurst('logo');
      goTo('hero');
      setMenuOpen(false);
    },
    [triggerBurst, goTo]
  );

  return (
    <nav className={`navbar${elevated ? ' navbar--scrolled' : ''}`}>
      <button
        type="button"
        className={`navbar__logo ${burstKey === 'logo' ? 'navbar__logo--burst' : ''}`}
        onClick={handleLogoClick}
        aria-label={`${PAGE_LABELS.hero}로 이동`}
      >
        <span className="navbar__logo-stack" aria-hidden="true">
          <span className="navbar__logo-word navbar__logo-word--en">eunjong</span>
          <span className="navbar__logo-word navbar__logo-word--ko">은종</span>
        </span>
        <BurstFx />
      </button>

      <ul className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.to} className="navbar__menu-item">
            <button
              type="button"
              onClick={() => {
                triggerBurst(item.to);
                goTo(item.to);
                setMenuOpen(false);
              }}
              className={`navbar__link ${pageId === item.to ? 'navbar__link--active' : ''} ${
                burstKey === item.to ? 'navbar__link--burst' : ''
              }`}
            >
              <span className="navbar__link-label">{item.label}</span>
              <BurstFx />
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar__actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
