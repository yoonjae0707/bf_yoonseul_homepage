import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import dbData from '@/data/db.json';
import styles from './news.module.css';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'brand', label: 'Brand' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'content', label: 'Content' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'contact', label: 'Contact' },
];

export async function generateStaticParams() {
  return dbData.news.map((n) => ({
    id: n.id.toString(),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Simple Markdown Renderer for news contents
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
        <div key={keyIndex++} style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          <img 
            src={imgUrl} 
            alt={altText} 
            style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid var(--card-border)' }} 
          />
          {altText && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{altText}</span>}
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
        <h4 key={keyIndex++} style={{ fontSize: '1.25rem', fontWeight: 800, margin: '20px 0 10px 0', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(4))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h3 key={keyIndex++} style={{ fontSize: '1.45rem', fontWeight: 855, margin: '24px 0 12px 0', borderBottom: '1px solid rgba(var(--foreground-raw), 0.08)', paddingBottom: '6px', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(3))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h2 key={keyIndex++} style={{ fontSize: '1.75rem', fontWeight: 900, margin: '28px 0 14px 0', color: 'var(--foreground)' }}>
          {parseInlineStyles(line.slice(2))}
        </h2>
      );
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const contentText = line.slice(2);
      currentList.push(
        <li key={`li-${keyIndex++}`} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
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
      <p key={keyIndex++} style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.8', margin: '12px 0' }}>
        {parseInlineStyles(line)}
      </p>
    );
  }

  flushList();

  return <div style={{ width: '100%' }}>{renderedElements}</div>;
};

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const newsId = parseInt(resolvedParams.id, 10);
  const item = dbData.news.find((n) => n.id === newsId);

  if (!item) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* Floating Header */}
      <Navbar activeTab="newsroom" tabs={TABS} />

      {/* Hero Section */}
      <section className={styles.hero}>
        {item.thumbnail_url && (
          <div className={styles.heroBgImage}>
            <img src={item.thumbnail_url} alt={item.title} className={styles.bgImg} />
            <div className={styles.heroOverlay} />
          </div>
        )}
        <div className={styles.bgGlow} style={{ background: item.colorGlow || (item as any).color_glow || 'rgba(255, 213, 129, 0.15)' }} />
        
        <div className={styles.heroContent}>
          <div className={styles.metaRow}>
            <span className={styles.pressBadge}>{item.press}</span>
            <span className={styles.dateLabel}>{item.date}</span>
          </div>
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.summary}>{item.summary}</p>
        </div>
      </section>

      {/* Main Detail Section */}
      <section className={styles.detailSection}>
        <div className={styles.gridContent}>
          {/* Main Body Card */}
          <div className={`${styles.articleCard} acrylic-card`}>
            <div className={styles.articleBody}>
              <MarkdownRenderer content={item.content} />
            </div>

            {item.link && (
              <div className={styles.articleFooter}>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="capsule-button"
                  style={{ display: 'inline-flex', gap: '6px', width: 'auto' }}
                >
                  <span>원문 기사 바로가기</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar Spec */}
          <div className={styles.sidebar}>
            <div className={`${styles.specCard} acrylic-card`}>
              <h3>보도 정보</h3>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>매체사</span>
                <span className={styles.specValue}>{item.press}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>보도일자</span>
                <span className={styles.specValue}>{item.date}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>제공처</span>
                <span className={styles.specValue}>BF YOONSEUL</span>
              </div>
            </div>

            <div className={styles.backBtnWrapper}>
              <Link href="/?tab=newsroom" className="capsule-button-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                ← 뉴스룸 목록으로
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
