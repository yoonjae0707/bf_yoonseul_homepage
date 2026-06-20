'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '@/data/db.json';
import styles from './PortfolioTab.module.css';

interface Project {
  id: number;
  title: string;
  category: 'planning' | 'design' | 'dev' | 'all';
  tags: string[];
  description: string;
  longDescription: string;
  proposalLink?: string;
  demoLink?: string;
  githubLink?: string;
  imageGlow: string;
}

const mapRawProjects = (rawProjects: any[]): Project[] => {
  return rawProjects.map((p: any) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tags: Array.isArray(p.tags) ? p.tags : [],
    description: p.description,
    longDescription: p.long_description || p.longDescription || '',
    proposalLink: p.proposal_link || p.proposalLink,
    demoLink: p.demo_link || p.demoLink,
    githubLink: p.github_link || p.githubLink,
    imageGlow: p.image_glow || p.imageGlow || '',
  }));
};

export default function PortfolioTab() {
  const [filter, setFilter] = useState<'all' | 'planning' | 'design' | 'dev'>('all');
  const [projects, setProjects] = useState<Project[]>(() => mapRawProjects(dbData.projects));
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  
  const [profile, setProfile] = useState({
    name: dbData.profile.name,
    tagline: dbData.profile.tagline,
    badges: Array.isArray(dbData.profile.badges) ? dbData.profile.badges : []
  });
  const router = useRouter();

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        if (data) {
          if (data.profile) {
            setProfile({
              name: data.profile.name,
              tagline: data.profile.tagline,
              badges: Array.isArray(data.profile.badges) ? data.profile.badges : []
            });
          }
          if (data.projects && data.projects.length > 0) {
            setProjects(mapRawProjects(data.projects));
          }
        }
      } catch (err) {
        console.warn('Using static fallback for portfolio/profile:', err);
      }
    }
    loadPortfolioData();
  }, []);

  const filteredProjects = projects.filter(
    (project) => filter === 'all' || project.category === filter || project.category === 'all'
  );

  const handleCardClick = (projectId: number) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
  };

  // Helper to strip markdown headings/styling for quick preview inside expanded card
  const getCleanPreviewText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/[#*`_-]/g, '') // remove markdown characters
      .replace(/\n+/g, ' ')    // collapse double line breaks
      .substring(0, 160) + '...';
  };

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Intro section */}
      <section className={styles.intro}>
        <div className={styles.avatar}>
          <div className={styles.avatarGlow} />
          <span>👤</span>
        </div>
        <div className={styles.introText}>
          <h2 className={styles.name}>{profile.name} 기획·개발·디자이너</h2>
          <p className={styles.tagline}>"{profile.tagline}"</p>
          <div className={styles.badges}>
            {profile.badges.map((badge, idx) => (
              <span key={idx} className={styles.badge}>{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className={styles.skillsSection}>
        <h3 className={styles.subTitle}>역량 매트릭스</h3>
        <div className={`${styles.skillsContainer} acrylic-card`}>
          <div className={styles.skillCategory}>
            <h4>기획</h4>
            <div className={styles.skillTags}>
              <span>시장 분석</span>
              <span>PRD 명세</span>
              <span>비즈니스 모델(BM)</span>
              <span>Figma 와이어프레임</span>
            </div>
          </div>
          <div className={styles.skillCategory}>
            <h4>개발</h4>
            <div className={styles.skillTags}>
              <span className={styles.highlightTag}>Flutter</span>
              <span className={styles.highlightTag}>Python</span>
              <span>FastAPI / Django</span>
              <span>Next.js / TS</span>
            </div>
          </div>
          <div className={styles.skillCategory}>
            <h4>디자인</h4>
            <div className={styles.skillTags}>
              <span>UI/UX</span>
              <span>브랜딩(BI/CI)</span>
              <span>아크릴모피즘</span>
              <span>마이크로 애니메이션</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Grid */}
      <section className={styles.portfolioSection}>
        <div className={styles.portfolioHeader}>
          <h3>포트폴리오 쇼케이스</h3>
          <div className={styles.filterCapsule}>
            {(['all', 'planning', 'design', 'dev'] as const).map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' && '전체'}
                {cat === 'planning' && '기획'}
                {cat === 'design' && '디자인'}
                {cat === 'dev' && '개발'}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className={styles.grid}>
          {filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            return (
              <div
                key={project.id}
                className={`${styles.projectCard} ${isExpanded ? styles.expandedCard : ''} acrylic-card`}
                onClick={() => handleCardClick(project.id)}
              >
                {/* Visual card backlight/glow */}
                <div 
                  className={`${styles.backlight} ${isExpanded ? styles.expandedBacklight : ''}`} 
                  style={{ background: project.imageGlow }} 
                />

                <div className={styles.cardContent}>
                  {/* Close button inside expanded card */}
                  {isExpanded && (
                    <button 
                      className={styles.closeBtn} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedProjectId(null);
                      }}
                      type="button"
                      aria-label="Collapse Details"
                    >
                      ✕
                    </button>
                  )}

                  <div className={styles.cardTags}>
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className={styles.cardTag}>{tag}</span>
                    ))}
                  </div>
                  
                  <h4 className={styles.cardTitle}>{project.title}</h4>
                  
                  {/* Card description shifts text based on expanded state */}
                  <p className={styles.cardDesc}>
                    {isExpanded 
                      ? getCleanPreviewText(project.longDescription) 
                      : project.description
                    }
                  </p>

                  {/* Expanded Actions - only visible when clicked */}
                  {isExpanded ? (
                    <div className={styles.actionGroup} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => router.push(`/portfolio/${project.id}`)}
                        className="capsule-button"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }}
                        type="button"
                      >
                        상세 분석 및 제안서 보기 →
                      </button>
                      {project.demoLink && project.demoLink !== '#' && (
                        <a 
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="capsule-button-outline"
                          style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto', textAlign: 'center' }}
                        >
                          데모 사이트 ↗
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className={styles.cardFooter}>
                      <span>상세 정보 펼치기</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
