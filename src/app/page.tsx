'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomeTab from '@/components/HomeTab';
import BrandTab from '@/components/BrandTab';
import PortfolioTab from '@/components/PortfolioTab';
import ContentTab from '@/components/ContentTab';
import ContactTab from '@/components/ContactTab';
import styles from './page.module.css';

const TABS = [
  { id: 'home', label: '홈' },
  { id: 'brand', label: '브랜드' },
  { id: 'portfolio', label: '포트폴리오' },
  { id: 'content', label: '컨텐츠' },
  { id: 'contact', label: '컨텍' },
];

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
      {/* Floating Capsule Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
      
      {/* Dynamic Main Body Content */}
      <main className={styles.mainContent}>
        <div className={`${styles.tabWrapper} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
          {renderTab === 'home' && <HomeTab />}
          {renderTab === 'brand' && <BrandTab />}
          {renderTab === 'portfolio' && <PortfolioTab />}
          {renderTab === 'content' && <ContentTab />}
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
              <span>이메일: contact@bf-yoonseul.com</span>
              <span className={styles.separator}>|</span>
              <span>주소: 서울특별시 마포구 백범로 (임의 주소)</span>
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
