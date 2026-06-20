'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export default function Navbar({ activeTab, setActiveTab, tabs }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleTabClick = (tabId: string) => {
    if (pathname !== '/') {
      router.push(`/?tab=${tabId}`);
    } else if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const affiliates = [
    { id: 'bf', name: 'BF Holdings', label: 'Holding Company', active: false, color: '#9a9b9d' },
    { id: 'yoonseul', name: 'BF YOONSEUL', label: 'IT & UX', active: true, color: 'var(--accent)' },
    { id: 'vccl', name: 'BF VCCL', label: 'VC & Accelerator', active: false, color: '#30d158' },
    { id: 'pns', name: 'BF Pns', label: 'Publishing & Service', active: false, color: '#ff9f0a' },
  ];

  const handleAffiliateClick = (aff: typeof affiliates[0]) => {
    setDropdownOpen(false);
    if (aff.active) {
      if (pathname !== '/') {
        router.push('/');
      } else if (setActiveTab) {
        setActiveTab('home');
      }
    } else {
      showToast(`${aff.name} brand site is coming soon.`);
    }
  };

  const mainTabs = tabs.filter((tab) => tab.id !== 'contact');
  const contactTab = tabs.find((tab) => tab.id === 'contact');

  return (
    <>
      <nav className={styles.navContainer}>
        {/* Logo / Affiliate Selector Capsule */}
        <div 
          className={styles.logoCapsule} 
          ref={dropdownRef}
          style={{
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 15, 22, 0.3)',
          }}
        >
          <div 
            className={`${styles.logo} ${dropdownOpen ? styles.logoActive : ''}`} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src="/logo.png" alt="BF YOONSEUL" className={styles.logoImg} />
            <div className={`${styles.chevron} ${dropdownOpen ? styles.chevronRotate : ''}`}>
              <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {dropdownOpen && (
            <div 
              className={styles.dropdown}
              style={{
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 15, 22, 0.3)',
              }}
            >
              <div className={styles.dropdownHeader}>Select BF Affiliate</div>
              <div className={styles.dropdownList}>
                {affiliates.map((aff) => (
                  <button
                    key={aff.id}
                    className={`${styles.dropdownItem} ${aff.active ? styles.activeItem : ''}`}
                    onClick={() => handleAffiliateClick(aff)}
                  >
                    <div className={styles.itemIndicator} style={{ background: aff.color }} />
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{aff.name}</span>
                      <span className={styles.itemLabel}>{aff.label}</span>
                    </div>
                    {aff.active && (
                      <span className={styles.activeBadge}>Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Tab List */}
        <div className={styles.tabList}>
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  backgroundColor: isActive
                    ? 'rgba(255, 213, 129, 0.3)'
                    : (theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 15, 22, 0.3)'),
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className={styles.actions}>
          {contactTab && (
            <button
              className={`${styles.contactBtn} ${activeTab === 'contact' ? styles.contactActive : ''}`}
              onClick={() => handleTabClick('contact')}
              style={{
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                backgroundColor: activeTab === 'contact'
                  ? 'rgba(255, 213, 129, 0.3)'
                  : (theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 15, 22, 0.3)'),
              }}
            >
              <span>{contactTab.label}</span>
              <div className={styles.contactArrow}>
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </button>
          )}

          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
            style={{
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 15, 22, 0.3)',
            }}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Premium Toast message */}
      {toastMessage && (
        <div className={styles.toast}>
          <div className={styles.toastContent}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
