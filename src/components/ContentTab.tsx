'use client';

import React, { useState, useEffect } from 'react';
import dbData from '@/data/db.json';
import styles from './ContentTab.module.css';

interface ContentItem {
  id: number;
  type: 'youtube' | 'instagram' | 'blog';
  title: string;
  thumbnail: string;
  stats: string;
  link: string;
  badge: string;
  colorGlow: string;
  videoId?: string;
  blogContent?: string;
}

const mapRawContents = (rawContents: any[]): ContentItem[] => {
  return (rawContents || []).map((c: any) => ({
    id: c.id,
    type: c.type,
    title: c.title,
    thumbnail: c.thumbnail,
    stats: c.stats,
    link: c.link,
    badge: c.badge,
    colorGlow: c.colorGlow || c.color_glow || '',
    videoId: c.videoId || c.video_id || undefined,
    blogContent: c.blogContent || c.blog_content || undefined,
  }));
};

// Simple Markdown Renderer for blog contents
const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let keyIndex = 0;

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} style={{ color: 'var(--foreground)', fontWeight: 700 }}>{part}</strong>;
      }
      return part;
    });
  };

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${keyIndex++}`} style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'disc' }}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for markdown image syntax: ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushList();
      const altText = imgMatch[1];
      const imgUrl = imgMatch[2];
      renderedElements.push(
        <div key={keyIndex++} style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          <img 
            src={imgUrl} 
            alt={altText} 
            style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1px solid var(--card-border)' }} 
          />
          {altText && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{altText}</span>}
        </div>
      );
      continue;
    }

    if (line === '---') {
      flushList();
      renderedElements.push(
        <hr key={keyIndex++} style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '24px 0' }} />
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h4 key={keyIndex++} style={{ fontSize: '1.2rem', fontWeight: 800, margin: '20px 0 10px 0', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(4))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h3 key={keyIndex++} style={{ fontSize: '1.35rem', fontWeight: 855, margin: '24px 0 12px 0', borderBottom: '1px solid rgba(var(--foreground-raw), 0.08)', paddingBottom: '6px', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(3))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h2 key={keyIndex++} style={{ fontSize: '1.6rem', fontWeight: 900, margin: '28px 0 14px 0', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(2))}
        </h2>
      );
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const contentText = line.slice(2);
      currentList.push(
        <li key={`li-${keyIndex++}`} style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {parseInlineStyles(contentText)}
        </li>
      );
      continue;
    }

    if (line === '') {
      flushList();
      continue;
    }

    flushList();
    renderedElements.push(
      <p key={keyIndex++} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.75', margin: '12px 0' }}>
        {parseInlineStyles(line)}
      </p>
    );
  }

  flushList();

  return <div style={{ width: '100%' }}>{renderedElements}</div>;
};

export default function ContentTab() {
  const [filter, setFilter] = useState<'all' | 'youtube' | 'instagram' | 'blog'>('all');
  const [contents, setContents] = useState<ContentItem[]>(() => mapRawContents(dbData.contents));
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<ContentItem | null>(null);

  useEffect(() => {
    async function loadContents() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        if (data && data.contents && data.contents.length > 0) {
          setContents(mapRawContents(data.contents));
        }
      } catch (err) {
        console.warn('Using static fallback for contents:', err);
      }
    }
    loadContents();
  }, []);

  const filteredContents = contents.filter(
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
          {(['all', 'youtube', 'instagram', 'blog'] as const).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' && '전체'}
              {cat === 'youtube' && 'YouTube'}
              {cat === 'instagram' && 'Instagram'}
              {cat === 'blog' && 'Blog'}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {filteredContents.map((item) => {
            const isYoutubeWithVideoId = item.type === 'youtube' && item.videoId;
            const isBlogType = item.type === 'blog';

            const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (isYoutubeWithVideoId) {
                e.preventDefault();
                setSelectedVideoId(item.videoId!);
              } else if (isBlogType) {
                e.preventDefault();
                setSelectedBlog(item);
              }
            };

            return (
              <a
                key={item.id}
                href={item.link}
                target={(isYoutubeWithVideoId || isBlogType) ? undefined : "_blank"}
                rel={(isYoutubeWithVideoId || isBlogType) ? undefined : "noopener noreferrer"}
                onClick={handleCardClick}
                className={`${styles.contentCard} acrylic-card`}
                style={{ '--glow-color': item.colorGlow } as React.CSSProperties}
              >
                {/* Fake Media Thumbnail Box */}
                <div className={styles.thumbnailBox}>
                  {item.type === 'youtube' && (
                    <div className={styles.youtubePlayIcon}>
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  )}
                  {item.type === 'instagram' && (
                    <div className={styles.instagramIcon}>
                      <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                  )}
                  {item.type === 'blog' && (
                    <div className={styles.blogIcon}>
                      <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
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
            );
          })}
        </div>
      </section>

      {/* Video Modal Player */}
      {selectedVideoId && (
        <div className={styles.modalOverlay} onClick={() => setSelectedVideoId(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedVideoId(null)}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBlog(null)}>
          <div className={`${styles.modalContent} ${styles.blogModalContent}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedBlog(null)}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className={styles.blogReaderBox}>
              <span className={`${styles.typeBadge} ${styles.blog}`} style={{ display: 'inline-block', marginBottom: '12px' }}>
                {selectedBlog.badge}
              </span>
              <h2 className={styles.blogTitle}>{selectedBlog.title}</h2>
              <p className={styles.blogMeta}>{selectedBlog.stats}</p>
              <hr className={styles.blogDivider} />
              <div className={styles.blogBody}>
                {selectedBlog.blogContent ? (
                  <MarkdownRenderer content={selectedBlog.blogContent} />
                ) : (
                  <p>본문 내용이 비어있습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
