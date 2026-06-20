import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import dbData from '@/data/db.json';
import styles from './brand.module.css';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'brand', label: 'Brand' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'content', label: 'Content' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'contact', label: 'Contact' },
];

export async function generateStaticParams() {
  return dbData.brands.map((b) => ({
    id: b.id.toString(),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BrandDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const brandId = parseInt(resolvedParams.id, 10);
  const brand = dbData.brands.find((b) => b.id === brandId);

  if (!brand) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* Floating Header */}
      <Navbar activeTab="brand" tabs={TABS} />

      {/* Full screen Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.bgGlow} style={{ background: brand.logo_color_glow }} />
        
        <div className={styles.heroContent}>
          <span className={styles.typeBadge}>{brand.type} IDENTITY</span>
          <h1 className={styles.title}>{brand.name}</h1>
          <p className={styles.slogan}>"{brand.slogan}"</p>
        </div>

        <div className={styles.scrollIndicator}>
          <span>SCROLL DOWN</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className={styles.detailSection}>
        <div className={styles.gridSection}>
          {/* Brand Story */}
          <div className={styles.storyContent}>
            <h2>Brand Story</h2>
            <p>{brand.description}</p>
          </div>

          {/* Brand Visual Logo (HTML CSS Shape or Custom Logo Image) */}
          <div className={`${styles.brandVisualCard} acrylic-card`}>
            <div className={styles.visualBg} style={{ background: brand.logo_color_glow }} />
            
            {(brand as any).logo_url ? (
              <div className={styles.logoImageWrapper}>
                <img src={(brand as any).logo_url} alt={`${brand.name} logo`} className={styles.uploadedLogoImg} />
              </div>
            ) : (
              <>
                {brand.logo_shape === 'ripple' && (
                  <div className={styles.logoRipple}>
                    <div className={styles.ripple1}></div>
                    <div className={styles.ripple2}></div>
                    <div className={styles.ripple3}></div>
                  </div>
                )}

                {brand.logo_shape === 'tech' && (
                  <div className={styles.logoTech}>
                    <div className={styles.cube}>
                      <div className={styles.innerNode}></div>
                    </div>
                  </div>
                )}

                {brand.logo_shape === 'studio' && (
                  <div className={styles.logoStudio}>
                    <div className={styles.capsule1}></div>
                    <div className={styles.capsule2}></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Design System Guidelines */}
        <div className={styles.guidelines}>
          {/* Brand Colors */}
          <div className={`${styles.guideCard} acrylic-card`}>
            <h3>Brand Colors</h3>
            <div className={styles.colorList}>
              {brand.colors.map((color, idx) => (
                <div key={idx} className={styles.colorSwatchRow}>
                  <div className={styles.swatch} style={{ backgroundColor: color.hex }} />
                  <div className={styles.colorInfo}>
                    <span className={styles.colorName}>{color.name}</span>
                    <span className={styles.colorHex}>{color.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className={`${styles.guideCard} acrylic-card`}>
            <h3>Typography</h3>
            <div className={styles.typoInfo}>
              <span className={styles.fontTitle}>Primary Brand Typeface</span>
              <p className={styles.fontDesc}>
                심플하면서도 기하학적인 조형미를 살린 브랜드 전용 타이포그래피 시스템입니다.
              </p>
              <div className={styles.fontSample} style={{ fontFamily: 'var(--font-sans)' }}>
                {brand.typography.split('/')[0]?.trim() || 'Outfit'}
              </div>
              <span className={styles.colorHex}>{brand.typography}</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className={styles.backBtnWrapper}>
          <Link href="/?tab=brand" className="capsule-button-outline">
            ← 브랜드 아카이브로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}
