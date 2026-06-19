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
    title: '티머니GO 공모전 - 대중교통 서비스 혁신 기획서',
    category: 'planning',
    tags: ['기획', '서비스 기획', '공모전', '제안서'],
    description: '대중교통 활성화를 위한 티머니GO 신규 리워드 서비스 제안 및 비즈니스 모델 설계 공모전 수상 기획서입니다.',
    longDescription: '본 기획서는 사용자 리서치 및 페르소나 분석을 바탕으로, 티머니GO 사용자가 대중교통 이용 시 획득하는 마일리지를 친환경 리워드 마켓과 연계하여 앱 활성화를 이끌어내는 전략적 PRD(제품 요구 사양서)입니다. 시장 규모 추정(TAM-SAM-SOM) 및 비즈니스 모델 캔버스(BMC), 정보 구조(IA) 설계를 포괄적으로 포함하고 있습니다.',
    proposalLink: '#',
    imageGlow: 'linear-gradient(135deg, #0071e3, #30d158)'
  },
  {
    id: 2,
    title: 'RITUDY - 뽀모도로 몰입 스터디 타이머 앱',
    category: 'dev',
    tags: ['개발', 'Flutter', '디자인', 'UI/UX'],
    description: '몰입의 흐름을 시각적으로 전하는 스마트 스터디 타이머 RITUDY입니다. Flutter와 Dart를 활용해 둥근 인터랙션을 구현했습니다.',
    longDescription: 'RITUDY는 학습 습관 정착을 위한 크로스플랫폼 모바일 앱입니다. Flutter의 AnimationController와 Canvas API를 직접 다뤄 부드럽고 쫀득한 타이머 게이지 모션을 구현했으며, 로컬 알림 서비스 연동 및 통계 분석 화면을 갖추고 있습니다.',
    demoLink: '#',
    githubLink: 'https://github.com',
    imageGlow: 'linear-gradient(135deg, #30d158, #86868b)'
  },
  {
    id: 3,
    title: 'RIBBLE - 버추얼 슈퍼앱 통합 플랫폼 데모',
    category: 'all',
    tags: ['기획', '개발', '디자인', 'Flutter', 'Python'],
    description: '채팅, 쇼핑, 가상 아바타 제어 및 생산성 도구를 결합한 가상 크로스플랫폼 슈퍼앱 RIBBLE입니다.',
    longDescription: 'RIBBLE은 가상 세계와 일상을 심리스하게 연동하는 대규모 다기능 플랫폼 데모입니다. Flutter 기반의 완성도 높은 클라이언트 앱과 Python FastAPI / PostgreSQL 연동 백엔드를 구축하여, 실시간 동기화 채팅, 웹소켓 기반 아바타 제어 등을 통합 구현했습니다.',
    proposalLink: '#',
    demoLink: '#',
    githubLink: 'https://github.com',
    imageGlow: 'linear-gradient(135deg, #bf5af2, #00f2fe)'
  },
  {
    id: 4,
    title: '성북구청 - 관공서 비주얼 아이덴티티 리브랜딩',
    category: 'design',
    tags: ['디자인', '브랜딩', 'CI/BI'],
    description: '역사적 가치와 미래 모빌리티 친화적인 이미지를 결합한 성북구청의 새로운 로고 및 브랜드 가이드라인 디자인입니다.',
    longDescription: '성북구의 대표적인 역사 문화재와 자율주행 모빌리티 시대를 대비하는 스마트 도시 계획을 융합한 관공서 리브랜딩 프로젝트입니다. 심벌마크, 전용 서체 가이드, 각종 어플리케이션(명함, 서식류, 홍보용 차량 등) 비주얼 시스템을 총체적으로 디자인했습니다.',
    demoLink: '#',
    imageGlow: 'linear-gradient(135deg, #ff2997, #ff9f0a)'
  },
  {
    id: 5,
    title: '티머니GO - 모바일 앱 UI/UX 리브랜딩 디자인',
    category: 'design',
    tags: ['디자인', 'UI/UX', '브랜딩', 'Figma'],
    description: '티머니GO 모바일 앱의 화면 사용성 대폭 개선을 위한 캡슐형 UI 레이아웃 리브랜딩 가이드입니다.',
    longDescription: '기존 복잡한 메뉴 트리를 가진 모바일 앱의 구조를 개편하고, 한 손 파지가 편리한 캡슐형 플로팅 내비게이션 및 아크릴모피즘 카드를 접목한 사용자 인터페이스 개선 프로젝트입니다. Figma 컴포넌트 라이브러리 및 하이파이 프로토타입 디자인이 포함되어 있습니다.',
    proposalLink: '#',
    imageGlow: 'linear-gradient(135deg, #ff453a, #ff9f0a)'
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
          <h2 className={styles.name}>소윤재 기획·개발·디자이너</h2>
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
                <a href={selectedProject.demoLink} className="capsule-button" onClick={(e) => { e.preventDefault(); alert('데모 체험(데모): 준비중인 라이브 링크입니다.'); }}>
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
