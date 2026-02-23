import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', to: 'about' },
    { label: 'Skills', to: 'skills' },
    { label: 'Education', to: 'education' },
    { label: 'Experience', to: 'experience' },
    { label: 'Projects', to: 'projects' },
    { label: 'Contact', to: 'contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__logo">
        <Link to="hero" smooth duration={600} style={{ cursor: 'pointer' }}>
          &lt;EJ /&gt;
        </Link>
      </div>

      <ul className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              smooth
              duration={600}
              offset={-70}
              onClick={() => setMenuOpen(false)}
              className="navbar__link"
              activeClass="navbar__link--active"
              spy
            >
              {item.label}
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
