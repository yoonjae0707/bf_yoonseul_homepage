'use client';

import React from 'react';
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
}

const BRANDS: Brand[] = [
  {
    id: 1,
    name: 'BF YOONSEUL',
    type: 'CI',
    slogan: 'Shining Ripple in Digital Space',
    description: 'BF YOONSEUL의 메인 기업 이미지(CI)입니다. 디지털이라는 광활한 바다 위에서 햇빛에 반사되어 찬란하게 빛나는 윤슬(잔물결)을 형상화했습니다. 기획, 디자인, 기술력의 융합을 상징합니다.',
    colors: [
      { name: 'Yoonseul Blue', hex: '#2997ff' },
      { name: 'Brilliant Fuchsia', hex: '#ff2997' },
      { name: 'Space Black', hex: '#070709' }
    ],
    typography: 'Outfit / Inter (Bold & Clean Sans-Serif)',
    logoShape: 'ripple',
    logoColorGlow: 'linear-gradient(135deg, #2997ff, #ff2997)'
  },
  {
    id: 2,
    name: 'Yoonseul Tech',
    type: 'BI',
    slogan: 'Precision Backend & AI Systems',
    description: 'BF YOONSEUL의 인프라 및 AI 기술 전문 부서의 브랜드 이미지(BI)입니다. Python 프레임워크 기반의 고성능 서버 구축, 데이터 엔지니어링, 그리고 신뢰할 수 있는 정밀한 알고리즘 설계를 상징합니다.',
    colors: [
      { name: 'Tech Teal', hex: '#00f2fe' },
      { name: 'Deep Cyber Blue', hex: '#0071e3' },
      { name: 'Steel Gray', hex: '#86868b' }
    ],
    typography: 'JetBrains Mono / Inter (Structured & Modern)',
    logoShape: 'tech',
    logoColorGlow: 'linear-gradient(135deg, #00f2fe, #0071e3)'
  },
  {
    id: 3,
    name: 'Yoonseul Studio',
    type: 'BI',
    slogan: 'Creative Flutter Apps & UI Design',
    description: '모바일/웹 UI 디자인 및 크로스플랫폼 Flutter 앱 전문 스튜디오 브랜드(BI)입니다. 사용자 중심의 탁월한 사용성, 세련된 아크릴모피즘 레이어링, 한 손 조작을 배려하는 둥글둥글한 인터페이스를 추구합니다.',
    colors: [
      { name: 'Studio Amber', hex: '#ff9f0a' },
      { name: 'Neon Purple', hex: '#bf5af2' },
      { name: 'Soft Gray', hex: '#f5f5f7' }
    ],
    typography: 'Outfit / Apple SD Gothic Neo (Vibrant & Round)',
    logoShape: 'studio',
    logoColorGlow: 'linear-gradient(135deg, #ff9f0a, #bf5af2)'
  }
];

export default function BrandTab() {
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

      {/* Brands Grid */}
      <section className={styles.brandGrid}>
        {BRANDS.map((brand) => (
          <div key={brand.id} className={`${styles.brandCard} acrylic-card`}>
            {/* Visual Logo Container */}
            <div className={styles.logoContainer}>
              <div className={styles.bgGlow} style={{ background: brand.logoColorGlow }} />
              
              {/* Logo Designs using pure CSS shapes for round & shiny look */}
              {brand.logoShape === 'ripple' && (
                <div className={styles.logoRipple}>
                  <div className={styles.ripple1}></div>
                  <div className={styles.ripple2}></div>
                  <div className={styles.ripple3}></div>
                </div>
              )}
              
              {brand.logoShape === 'tech' && (
                <div className={styles.logoTech}>
                  <div className={styles.cube}>
                    <div className={styles.innerNode}></div>
                  </div>
                </div>
              )}
              
              {brand.logoShape === 'studio' && (
                <div className={styles.logoStudio}>
                  <div className={styles.capsule1}></div>
                  <div className={styles.capsule2}></div>
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className={styles.brandInfo}>
              <div className={styles.brandHeader}>
                <span className={styles.typeBadge}>{brand.type}</span>
                <h3 className={styles.brandName}>{brand.name}</h3>
              </div>
              <p className={styles.slogan}>"{brand.slogan}"</p>
              <p className={styles.description}>{brand.description}</p>
              
              {/* Brand Guide Assets */}
              <div className={styles.assetsGrid}>
                {/* Colors */}
                <div className={styles.assetItem}>
                  <span className={styles.assetLabel}>Primary Colors</span>
                  <div className={styles.colorPalette}>
                    {brand.colors.map((color, idx) => (
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
                  <p className={styles.fontFamilyValue}>{brand.typography}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
