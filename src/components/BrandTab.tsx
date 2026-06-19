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
    name: 'RIBBLE',
    type: 'BI',
    slogan: 'Virtual Super-App for Modern Life',
    description: '가상과 현실을 긴밀하게 연결하는 버추얼 슈퍼앱 브랜드(BI)입니다. 채팅, 아바타, 쇼핑, 생산성 도구를 단 하나의 둥글둥글한 캡슐 인터페이스 안에 심리스(Seamless)하게 녹여냈습니다.',
    colors: [
      { name: 'Super Purple', hex: '#bf5af2' },
      { name: 'Cyan Shimmer', hex: '#00f2fe' },
      { name: 'Royal Velvet', hex: '#5e5ce6' }
    ],
    typography: 'Outfit / Inter (Modern & Friendly Rounded)',
    logoShape: 'studio',
    logoColorGlow: 'linear-gradient(135deg, #bf5af2, #00f2fe)'
  },
  {
    id: 3,
    name: 'RITUDY',
    type: 'BI',
    slogan: 'Focus & Grow Study Timer',
    description: '몰입의 깊이를 시각적으로 보여주는 스마트 스터디 타이머 브랜드(BI)입니다. 시간의 흐름을 둥글고 정밀한 타이머 게이지와 부드러운 햅틱 피드백 연출을 통해 직관적으로 보여줍니다.',
    colors: [
      { name: 'Focus Green', hex: '#30d158' },
      { name: 'Deep Forest', hex: '#093a14' },
      { name: 'Steel Gray', hex: '#86868b' }
    ],
    typography: 'JetBrains Mono / Inter (Structured & Numeric)',
    logoShape: 'tech',
    logoColorGlow: 'linear-gradient(135deg, #30d158, #86868b)'
  },
  {
    id: 4,
    name: 'RIMU',
    type: 'BI',
    slogan: 'Virtual Music Streaming Platform',
    description: '가상 아티스트와 팬덤을 잇는 버추얼 전문 음원 스트리밍 플랫폼 브랜드(BI)입니다. 소리의 아름다운 파동과 웅장한 공간감을 파스텔톤의 물결 파형 로고와 유려한 카드 모션으로 담아냈습니다.',
    colors: [
      { name: 'Melody Pink', hex: '#ff375f' },
      { name: 'Deep Indigo', hex: '#1c1c1e' },
      { name: 'Acoustic White', hex: '#f5f5f7' }
    ],
    typography: 'Outfit / Montserrat (Expressive & Dynamic)',
    logoShape: 'ripple',
    logoColorGlow: 'linear-gradient(135deg, #ff375f, #1c1c1e)'
  },
  {
    id: 5,
    name: 'RIUP',
    type: 'BI',
    slogan: 'Popup Store Waiting Platform',
    description: '실시간 대기열과 전국 팝업스토어 정보 조회를 돕는 웨이팅 플랫폼 브랜드(BI)입니다. 현장에서 기다리는 지루함을 해소하고 팝업 스토어의 흥미진진한 탐험 여정의 시작을 디자인합니다.',
    colors: [
      { name: 'Waiting Orange', hex: '#ff9f0a' },
      { name: 'Active Red', hex: '#ff453a' },
      { name: 'Light Canvas', hex: '#ffffff' }
    ],
    typography: 'Outfit / Apple SD Gothic Neo (Vibrant & Interactive)',
    logoShape: 'studio',
    logoColorGlow: 'linear-gradient(135deg, #ff9f0a, #ff453a)'
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
