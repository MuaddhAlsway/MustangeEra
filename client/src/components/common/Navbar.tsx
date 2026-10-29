import { AccountControl } from '../../lib/Auth';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, Heart, Menu, X } from 'lucide-react';
import '../../styles/Navbar.css';

type NavbarProps = {
  savedCount?: number;
};

export default function Navbar({ savedCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="mg-navbar">
      <NavLink
        className="mg-navbar__brand"
        to="/" end
        aria-label="Mustang Garage home"
        onClick={closeMenu}
      >
        <span className="mg-navbar__mark" aria-hidden="true">
          <span className="mg-navbar__mark-letter">M</span>
          <span className="mg-navbar__mark-lines">
            <i />
            <i />
            <i />
          </span>
        </span>

        <span className="mg-navbar__wordmark">
          MUSTANG
          <span>
            GARAGE <i>EST. MMXVIII</i>
          </span>
        </span>
      </NavLink>

      <nav
        className={`mg-navbar__links${menuOpen ? ' is-open' : ''}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        <NavLink to="/" end onClick={closeMenu}>
          <span>01</span> Home
        </NavLink>
        <NavLink to="/inventory" onClick={closeMenu}>
          <span>02</span> Inventory
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          <span>03</span> About the Garage
        </NavLink>
        <NavLink to="/journal" onClick={closeMenu}>
          <span>04</span> Journal
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          <span>05</span> Contact
        </NavLink>
        <AccountControl onNavigate={closeMenu}/>
      </nav>

      <div className="mg-navbar__actions">
        {savedCount > 0 && <NavLink
          className="mg-navbar__saved"
          to="/saved"
          onClick={closeMenu}
          aria-label={`${savedCount} saved ${savedCount === 1 ? 'car' : 'cars'}`}
        >
          <Heart size={16} strokeWidth={1.7} />
          <span className="mg-navbar__saved-label">Saved</span>
          <span className="mg-navbar__count">
            {String(savedCount).padStart(2, '0')}
          </span>
        </NavLink>}

        <NavLink className="mg-navbar__cta" to="/inventory" onClick={closeMenu}>
          <span>Find your Mustang</span>
          <ArrowUpRight size={15} strokeWidth={1.8} />
        </NavLink>
      </div>

      <button
        className="mg-navbar__toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(open => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

