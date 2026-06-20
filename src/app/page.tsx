'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HomeTab from '@/components/HomeTab';
import BrandTab from '@/components/BrandTab';
import PortfolioTab from '@/components/PortfolioTab';
import ContentTab from '@/components/ContentTab';
import NewsroomTab from '@/components/NewsroomTab';
import ContactTab from '@/components/ContactTab';
import styles from './page.module.css';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'brand', label: 'Brand' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'content', label: 'Content' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'contact', label: 'Contact' },
];

function SearchParamsHandler({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);
  return null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderTab, setRenderTab] = useState('home');

  // Smooth Apple-style fade & slide transition when switching tabs
  useEffect(() => {
    if (activeTab !== renderTab) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setRenderTab(activeTab);
        setIsTransitioning(false);
      }, 300); // matches the transition duration in CSS
      return () => clearTimeout(timer);
    }
  }, [activeTab, renderTab]);

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <SearchParamsHandler setActiveTab={setActiveTab} />
      </Suspense>
      {/* Floating Capsule Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
      
      {/* Dynamic Main Body Content */}
      <main className={styles.mainContent}>
        <div className={`${styles.tabWrapper} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
          {renderTab === 'home' && <HomeTab />}
          {renderTab === 'brand' && <BrandTab />}
          {renderTab === 'portfolio' && <PortfolioTab />}
          {renderTab === 'content' && <ContentTab />}
          {renderTab === 'newsroom' && <NewsroomTab />}
          {renderTab === 'contact' && <ContactTab />}
        </div>
      </main>
      
      {/* Detailed business info footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>BF YOONSEUL</div>
          <div className={styles.businessInfo}>
            <p>
              <span>상호명: BF YOONSEUL</span>
              <span className={styles.separator}>|</span>
              <span>대표자: 소윤재</span>
            </p>
            <p>
              <span>이메일: bfyoonseul@gmail.com</span>
            </p>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2026 BF YOONSEUL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
