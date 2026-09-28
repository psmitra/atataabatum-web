import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ThemeToggle } from '../ui/ThemeToggle';
import { HamburgerButton } from '../ui/HamburgerButton';
import { MobileNavDrawer } from './MobileNavDrawer';
import { HeaderControlsPortal } from './HeaderControlsPortal';

export const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
      setMenuOpen(false);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Markets', path: '/markets' },
    { label: 'Trade', path: '/trade' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Research', path: '/research' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300
          ${scrolled ? 'bg-d-blue/70 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-d-blue'}`}
      >
        <div className="max-w-[1440px] mx-auto px-6 py-5 sm:py-7 flex justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-ice/80 hover:text-ice text-xl sm:text-2xl">
              ATATAABATUM
            </Link>
            <span className="hidden min-[480px]:inline text-ice/80">|</span>

            <div className="hidden min-[480px]:flex items-center gap-2 sm:gap-4">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative text-sm sm:text-lg lg:text-xl after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-ice after:transition-all after:duration-300
                      ${isActive ? 'text-ice after:w-full' : 'text-ice/80 hover:text-ice after:w-0 hover:after:w-full'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Invisible placeholder — reserves layout space only, not interactive */}
          <div className="flex items-center gap-3 invisible" aria-hidden="true">
            <ThemeToggle />
            <div className="min-[480px]:hidden">
              <HamburgerButton isOpen={menuOpen} onClick={() => {}} />
            </div>
          </div>
        </div>
      </header>

      {/* Real, interactive controls — portaled above everything */}
      <HeaderControlsPortal>
        <ThemeToggle />
        <div className="min-[480px]:hidden">
          <HamburgerButton isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
        </div>
      </HeaderControlsPortal>

      <MobileNavDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};