'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Basic theme toggle using data-theme on html element
  useEffect(() => {
    // Enforce luxury dark theme brand guidelines and override any cached light mode
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/agent/login');
    router.refresh();
  };

  return (
    <div className={styles.layout}>
      <header className={`no-print ${styles.header}`}>
        <div className={styles.headerContainer}>
          <Link href="/agent/dashboard" className={styles.brand}>
            <Image src="/assets/logo.png" alt="Prime Property Logo" width={114} height={40} className={styles.brandLogo} priority />
          </Link>

          <div className={styles.actions}>
            <div className={styles.profileDropdown}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className={styles.profileButton}
              >
                <div className={styles.avatar}>
                  <User size={16} />
                </div>
                <span>Agent</span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
