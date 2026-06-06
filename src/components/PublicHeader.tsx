'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import styles from './PublicHeader.module.css';

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
          <Image src="/assets/logo.png" alt="Prime Property Logo" width={200} height={70} className={styles.logoImg} priority />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Beranda</Link>
          <Link href="/tentang-kami" className={styles.navLink}>Tentang Kami</Link>
          <Link href="/kontak" className={styles.navLink}>Kontak</Link>
        </nav>
        
        <div className={styles.actions}>
          <Link href="/agent/login" className="btn-outline">
            Login Agent
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className={styles.mobileMenuToggle} 
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
          <Link href="/tentang-kami" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Tentang Kami</Link>
          <Link href="/kontak" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
          <Link href="/agent/login" className={styles.mobileNavBtn} onClick={() => setIsMobileMenuOpen(false)}>
            Login Agent
          </Link>
        </nav>
      </div>
    </header>
  );
}
