import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, animateScroll as scroll } from 'react-scroll';

const BURST_MS = 900;

const BurstFx: React.FC = () => (
  <>
    <span className="navbar__burst-ring" aria-hidden="true" />
    <span className="navbar__burst-spark" aria-hidden="true" />
  </>
);

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [burstKey, setBurstKey] = useState<string | null>(null);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      scroll.scrollToTop({ duration: 700, smooth: 'easeInOutQuart' });
      setMenuOpen(false);
    },
    [triggerBurst]
  );

  const navItems = [
    { label: 'About', to: 'about' },
    { label: 'Skills', to: 'skills' },
    { label: 'Education', to: 'education' },
    { label: 'Experience', to: 'experience' },
    { label: 'Projects', to: 'projects' },
    { label: 'Work Log', to: 'worklog' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <button
        type="button"
        className={`navbar__logo ${burstKey === 'logo' ? 'navbar__logo--burst' : ''}`}
        onClick={handleLogoClick}
        aria-label="맨 위로 이동"
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
            <Link
              to={item.to}
              smooth
              duration={600}
              offset={-70}
              onClick={() => {
                triggerBurst(item.to);
                setMenuOpen(false);
              }}
              className={`navbar__link ${burstKey === item.to ? 'navbar__link--burst' : ''}`}
              activeClass="navbar__link--active"
              spy
            >
              <span className="navbar__link-label">{item.label}</span>
              <BurstFx />
            </Link>
          </li>
        ))}
      </ul>

      <button
        className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="메뉴 열기"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
};

export default Navbar;
