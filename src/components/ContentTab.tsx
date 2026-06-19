'use client';

import React, { useState } from 'react';
import styles from './ContentTab.module.css';

interface ContentItem {
  id: number;
  type: 'youtube' | 'instagram';
  title: string;
  thumbnail: string;
  stats: string;
  link: string;
  badge: string;
  colorGlow: string;
}

const CONTENTS: ContentItem[] = [
  {
    id: 1,
    type: 'youtube',
    title: '[STUDIO Peng1] 버추얼 크리에이티브 미디어 & 디자인 테크 채널',
    thumbnail: '🎬 STUDIO Peng1 Official Channel',
    stats: '구독자 1.2만명 • 동영상 48개',
    link: 'https://www.youtube.com/@STUDIOPeng1',
    badge: 'Virtual Art',
    colorGlow: 'rgba(255, 0, 0, 0.15)'
  },
  {
    id: 2,
    type: 'youtube',
    title: '[본리에어 / VONRI AIR] 힐링 버추얼 항공 여정 & ASMR 사운드 스트리밍',
    thumbnail: '✈️ VONRI AIR Streaming Channel',
    stats: '구독자 2.5만명 • 동영상 120개',
    link: 'https://www.youtube.com/@VONRIAIR',
    badge: 'V-Stream',
    colorGlow: 'rgba(255, 0, 0, 0.15)'
  },
  {
    id: 3,
    type: 'instagram',
    title: 'RIBBLE 버추얼 슈퍼앱 UI/UX 모바일 반응형 디자인 모듈 제작 비하인드',
    thumbnail: '📱 RIBBLE Super-App UX Guidelines',
    stats: '좋아요 4.8천개 • 3일 전',
    link: 'https://instagram.com',
    badge: 'Design UI',
    colorGlow: 'rgba(225, 48, 108, 0.15)'
  },
  {
    id: 4,
    type: 'instagram',
    title: 'RITUDY 공부 타이머 한 손 조작 캡슐형 인터페이스 설계 및 디자인 시스템',
    thumbnail: '🎨 RITUDY Design System & Haptic UX',
    stats: '좋아요 2.1천개 • 1주 전',
    link: 'https://instagram.com',
    badge: 'Product Design',
    colorGlow: 'rgba(225, 48, 108, 0.1)'
  }
];

export default function ContentTab() {
  const [filter, setFilter] = useState<'all' | 'youtube' | 'instagram'>('all');

  const filteredContents = CONTENTS.filter(
    (item) => filter === 'all' || item.type === filter
  );

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.badge}>ARCHIVE</div>
        <h2 className={styles.title}>크리에이티브 아카이브</h2>
        <p className={styles.subtitle}>
          유튜브와 인스타그램에 공유하고 있는 IT 기획, 개발 기술 튜토리얼 및 디자인 비하인드 스토리 콘텐츠입니다.
        </p>

        {/* Filter */}
        <div className={styles.filterCapsule}>
          {(['all', 'youtube', 'instagram'] as const).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' && '전체'}
              {cat === 'youtube' && 'YouTube'}
              {cat === 'instagram' && 'Instagram'}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {filteredContents.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.contentCard} acrylic-card`}
              style={{ '--glow-color': item.colorGlow } as React.CSSProperties}
            >
              {/* Fake Media Thumbnail Box */}
              <div className={styles.thumbnailBox}>
                {item.type === 'youtube' ? (
                  <div className={styles.youtubePlayIcon}>
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                ) : (
                  <div className={styles.instagramIcon}>
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                )}
                <span className={styles.thumbnailTitle}>{item.thumbnail}</span>
              </div>

              {/* Text Info */}
              <div className={styles.info}>
                <div className={styles.tagsRow}>
                  <span className={`${styles.typeBadge} ${styles[item.type]}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className={styles.tag}>{item.badge}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardStats}>{item.stats}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
