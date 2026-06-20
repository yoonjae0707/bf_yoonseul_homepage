'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '@/data/db.json';
import styles from './NewsroomTab.module.css';

interface NewsItem {
  id: number;
  title: string;
  press: string;
  date: string;
  link: string;
  summary: string;
  content: string;
  colorGlow?: string;
  thumbnailUrl?: string;
}

const mapRawNews = (rawNews: any[]): NewsItem[] => {
  return (rawNews || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    press: n.press,
    date: n.date,
    link: n.link,
    summary: n.summary,
    content: n.content,
    colorGlow: n.colorGlow || n.color_glow || 'rgba(255, 213, 129, 0.15)',
    thumbnailUrl: n.thumbnailUrl || n.thumbnail_url || '',
  }));
};

export default function NewsroomTab() {
  const [news, setNews] = useState<NewsItem[]>(() => mapRawNews(dbData.news));
  const router = useRouter();

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        if (data && data.news && data.news.length > 0) {
          setNews(mapRawNews(data.news));
        }
      } catch (err) {
        console.warn('Using static fallback for news:', err);
      }
    }
    loadNews();
  }, []);

  // Sort by date descending
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.badge}>NEWSROOM</div>
        <h2 className={styles.title}>보도자료 & 뉴스룸</h2>
        <p className={styles.subtitle}>
          BF YOONSEUL과 산하 브랜드의 대외 홍보 보도자료 및 공식 뉴스 아카이브입니다.
        </p>
      </section>

      {/* Grid of news cards */}
      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {sortedNews.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/news/${item.id}`)}
              className={`${styles.newsCard} acrylic-card`}
              style={{ '--glow-color': item.colorGlow } as React.CSSProperties}
            >
              {/* Backlight / Glow effect */}
              <div className={styles.backlight} style={{ background: item.colorGlow }} />

              {item.thumbnailUrl && (
                <div className={styles.cardThumbnail}>
                  <img src={item.thumbnailUrl} alt={item.title} className={styles.thumbnailImg} />
                </div>
              )}

              <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                  <span className={styles.pressBadge}>{item.press}</span>
                  <span className={styles.dateLabel}>{item.date}</span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSummary}>{item.summary}</p>

                <div className={styles.cardFooter}>
                  <span>자세히 보기</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
