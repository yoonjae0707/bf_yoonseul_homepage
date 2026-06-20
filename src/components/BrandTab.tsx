'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '@/data/db.json';
import styles from './BrandTab.module.css';

interface Brand {
  id: number;
  name: string;
  type: 'CI' | 'BI';
  slogan: string;
  description: string;
  colors: { name: string; hex: string }[];
  typography: string;
  logoShape: 'ripple' | 'tech' | 'studio';
  logoColorGlow: string;
  logoUrl?: string;
}

const mapRawBrands = (rawBrands: any[]): Brand[] => {
  return rawBrands.map((b: any) => ({
    id: b.id,
    name: b.name,
    type: b.type,
    slogan: b.slogan,
    description: b.description,
    colors: Array.isArray(b.colors) ? b.colors : [],
    typography: b.typography,
    logoShape: b.logo_shape || b.logoShape || 'ripple',
    logoColorGlow: b.logo_color_glow || b.logoColorGlow || '',
    logoUrl: b.logo_url || b.logoUrl || '',
  }));
};

export default function BrandTab() {
  const [brands, setBrands] = useState<Brand[]>(() => mapRawBrands(dbData.brands));
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        if (data && data.brands && data.brands.length > 0) {
          setBrands(mapRawBrands(data.brands));
        }
      } catch (err) {
        console.warn('Using static fallback for brands:', err);
      }
    }
    loadBrands();
  }, []);

  const activeBrand = brands[activeIdx] || brands[0];

  const handleBrandChange = (idx: number) => {
    if (idx === activeIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsTransitioning(false);
    }, 250); // Matches transition timing
  };

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.badge}>IDENTITY</div>
        <h2 className={styles.title}>브랜드 아이덴티티</h2>
        <p className={styles.subtitle}>
          BF YOONSEUL과 산하 전문 부서들이 추구하는 아이덴티티 및 가치 디자인(CI/BI) 시스템 아카이브입니다.
        </p>
      </section>

      {/* Vertical Navigation Section */}
      <section className={styles.navigatorSection}>
        {/* Left Side: Brand Selection Tabs */}
        <div className={styles.sidebar}>
          {brands.map((brand, idx) => (
            <button
              key={brand.id}
              className={`${styles.sidebarBtn} ${activeIdx === idx ? styles.activeBtn : ''}`}
              onClick={() => handleBrandChange(idx)}
              type="button"
            >
              <span className={styles.sidebarBadge}>{brand.type}</span>
              <span className={styles.sidebarName}>{brand.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Dynamically Loaded Detailed Container */}
        {activeBrand && (
          <div className={`${styles.detailBox} acrylic-card ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            {/* Visual Logo block */}
            <div className={styles.logoPane}>
              <div className={styles.bgGlow} style={{ background: activeBrand.logoColorGlow }} />
              
              {activeBrand.logoUrl ? (
                <div className={styles.logoWrapper}>
                  <img 
                    src={activeBrand.logoUrl} 
                    alt={`${activeBrand.name} logo`} 
                    className={styles.uploadedLogo}
                  />
                </div>
              ) : (
                <div className={styles.logoWrapper}>
                  {/* Ripple shape */}
                  {activeBrand.logoShape === 'ripple' && (
                    <div className={styles.logoRipple}>
                      <div className={styles.ripple1}></div>
                      <div className={styles.ripple2}></div>
                      <div className={styles.ripple3}></div>
                    </div>
                  )}
                  
                  {/* Tech cube */}
                  {activeBrand.logoShape === 'tech' && (
                    <div className={styles.logoTech}>
                      <div className={styles.cube}>
                        <div className={styles.innerNode}></div>
                      </div>
                    </div>
                  )}
                  
                  {activeBrand.logoShape === 'studio' && (
                    <div className={styles.logoStudio}>
                      <div className={styles.capsule1}></div>
                      <div className={styles.capsule2}></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content info block */}
            <div className={styles.brandDetails}>
              <div className={styles.brandMeta}>
                <span className={styles.typeTag}>{activeBrand.type}</span>
                <h3 className={styles.brandTitle}>{activeBrand.name}</h3>
              </div>
              <p className={styles.slogan}>"{activeBrand.slogan}"</p>
              <p className={styles.description}>{activeBrand.description}</p>

              {/* Guide Assets */}
              <div className={styles.assetsGrid}>
                {/* Colors palette */}
                <div className={styles.assetItem}>
                  <span className={styles.assetLabel}>Primary Colors</span>
                  <div className={styles.colorPalette}>
                    {activeBrand.colors.map((color, idx) => (
                      <div key={idx} className={styles.colorSwatchWrapper} title={`${color.name}: ${color.hex}`}>
                        <div className={styles.colorSwatch} style={{ backgroundColor: color.hex }} />
                        <span className={styles.colorHex}>{color.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className={styles.assetItem}>
                  <span className={styles.assetLabel}>Typography</span>
                  <p className={styles.fontFamilyValue}>{activeBrand.typography}</p>
                </div>
              </div>

              {/* Navigate details button */}
              <div className={styles.actionsRow}>
                <button
                  onClick={() => router.push(`/brand/${activeBrand.id}`)}
                  className="capsule-button"
                  type="button"
                  style={{ width: 'auto', padding: '10px 24px' }}
                >
                  브랜드 가이드 및 세부 정보 보기 →
                </button>
              </div>

            </div>
          </div>
        )}
      </section>
    </div>
  );
}
