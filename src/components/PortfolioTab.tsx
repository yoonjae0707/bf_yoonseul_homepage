'use client';

import React, { useState } from 'react';
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

const PROJECTS: Project[] = [
  {
    id: 1,
    title: '동글페이 - 캡슐형 핀테크 모바일 앱 서비스',
    category: 'all',
    tags: ['기획', '디자인', '개발', 'Flutter', 'Python'],
    description: '아크릴모피즘 디자인과 직관적인 캡슐 형태 인터페이스를 적용한 편리한 간편 송금/결제 서비스 플랫폼입니다.',
    longDescription: '동글페이는 기존 핀테크 앱들의 복잡한 UI를 탈피하여, 모든 컨트롤러를 동글동글한 캡슐 버튼 모양으로 설계하여 한 손 조작을 편리하게 한 서비스입니다. 기획 단계에서의 페르소나 정의 및 화면 설계, Figma 기반 UI/UX 가이드라인 작성, 그리고 Flutter 크로스플랫폼과 Python FastAPI 백엔드를 연동해 고성능 실시간 송금 시스템 데모까지 전체 과정을 직접 수행했습니다.',
    proposalLink: '#',
    demoLink: '#',
    githubLink: 'https://github.com',
    imageGlow: 'linear-gradient(135deg, #2997ff, #0071e3)'
  },
  {
    id: 2,
    title: '윤슬아카이브 - 공모전 & 리서치 기획 플랫폼',
    category: 'planning',
    tags: ['기획', '서비스 기획', '비즈니스 모델'],
    description: '대학생 및 예비 창업자들을 위한 국내 공모전 분석 및 기획서 템플릿 아카이빙 웹 서비스 기획서입니다.',
    longDescription: '전국 단위 IT 공모전 수상 기획서 분석 리포트입니다. 타겟 분석, 시장 규모 추정(TAM-SAM-SOM), 세부 기능 명세(PRD), 정보 구조(IA) 설계를 포함하고 있으며 실제 비즈니스 모델로의 연계 방안을 체계적으로 서술한 기획서 원본 PDF 다운로드를 제공합니다.',
    proposalLink: '#',
    imageGlow: 'linear-gradient(135deg, #ff2997, #ff5e62)'
  },
  {
    id: 3,
    title: 'Yoonseul Vision AI - 객체 인식 분석 대시보드',
    category: 'dev',
    tags: ['개발', 'Python', 'FastAPI', 'PyTorch'],
    description: 'Python PyTorch 기반 실시간 영상 인식 백엔드 서버 및 관제용 웹 데모 대시보드입니다.',
    longDescription: '웹캠 또는 CCTV 입력을 분석하여 실시간 밀집도를 분석하는 산업 안전용 AI 플랫폼입니다. 백엔드는 Python을 사용하여 초당 30프레임 이상의 처리량을 보장하도록 멀티프로세싱 파이프라인을 구축했고, 웹 대시보드는 대용량 전송을 최적화하기 위해 WebSockets로 연동되어 있습니다.',
    demoLink: '#',
    githubLink: 'https://github.com',
    imageGlow: 'linear-gradient(135deg, #00f2fe, #4facfe)'
  },
  {
    id: 4,
    title: '애플 감성 프리미엄 가구 브랜드 UI/UX 디자인',
    category: 'design',
    tags: ['디자인', 'UI/UX', 'Figma', 'Acrylicmorphism'],
    description: '부드러운 마이크로 애니메이션과 반투명 아크릴 레이어링을 활용한 모던 이커머스 웹 디자인 콘셉트입니다.',
    longDescription: 'Apple의 프리미엄 디자인 언어를 차용하여 완성한 하이엔드 가구 쇼핑몰 UI/UX입니다. 빛과 유리의 굴절을 극대화한 아크릴모피즘 카드와 캡슐형 퀵 내비게이션 바, 쫀득한 트랜지션을 적용해 모바일과 데스크톱 레이아웃 전환 시 끊김 없는 가독성을 제공하는 완벽한 가이드 디자인 세트입니다.',
    demoLink: '#',
    imageGlow: 'linear-gradient(135deg, #ffd000, #ff5e62)'
  }
];

export default function PortfolioTab() {
  const [filter, setFilter] = useState<'all' | 'planning' | 'design' | 'dev'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(
    (project) => filter === 'all' || project.category === filter || project.category === 'all'
  );

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Intro section */}
      <section className={styles.intro}>
        <div className={styles.avatar}>
          <div className={styles.avatarGlow} />
          <span>👤</span>
        </div>
        <div className={styles.introText}>
          <h2 className={styles.name}>윤슬 기획·개발·디자이너</h2>
          <p className={styles.tagline}>
            "기획서에서 시작해 코드 한 줄, 마이크로 픽셀 하나까지 직접 만들어 갑니다."
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Planning</span>
            <span className={styles.badge}>Flutter Dev</span>
            <span className={styles.badge}>Python Back-End</span>
            <span className={styles.badge}>UI/UX Design</span>
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
          {/* Sub Capsule Navigation */}
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`${styles.projectCard} acrylic-card`}
              onClick={() => setSelectedProject(project)}
            >
              {/* Backlight Glow effect for premium feel */}
              <div className={styles.backlight} style={{ background: project.imageGlow }} />
              
              <div className={styles.cardContent}>
                <div className={styles.cardTags}>
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className={styles.cardTag}>{tag}</span>
                  ))}
                </div>
                <h4 className={styles.cardTitle}>{project.title}</h4>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.cardFooter}>
                  <span>자세히 보기</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={`${styles.modalContent} acrylic-card`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedProject(null)} aria-label="Close modal">
              ✕
            </button>
            
            <div className={styles.modalTags}>
              {selectedProject.tags.map((tag, idx) => (
                <span key={idx} className={styles.modalTag}>{tag}</span>
              ))}
            </div>
            
            <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
            
            <p className={styles.modalLongDesc}>{selectedProject.longDescription}</p>
            
            <div className={styles.modalCtaGroup}>
              {selectedProject.proposalLink && (
                <a href={selectedProject.proposalLink} className="capsule-button" onClick={(e) => { e.preventDefault(); alert('기획서 다운로드(데모): 준비중인 파일입니다.'); }}>
                  📄 기획서 다운로드
                </a>
              )}
              {selectedProject.demoLink && (
                <a href={selectedProject.demoLink} className="capsule-button" onClick={(e) => { e.preventDefault(); alert('데모 사이트 이동(데모): 준비중인 라이브 링크입니다.'); }}>
                  🔗 웹/앱 데모 체험
                </a>
              )}
              {selectedProject.githubLink && (
                <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="capsule-button-outline">
                  💻 GitHub 소스코드
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
