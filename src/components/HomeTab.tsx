'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeTab.module.css';

// 1. Floating Sphere (Mouse Parallax)
const FloatingSphere = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) * 0.035;
      const y = (clientY - window.innerHeight / 2) * 0.035;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={styles.floatingSphere}
      style={{
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) rotate(${mousePos.x * 0.5}deg)`,
      }}
    >
      <div className={styles.sphereInner} />
    </div>
  );
};

// Mock Projects for Corporate Project Lab
const LAB_PROJECTS = [
  {
    id: 1,
    title: 'RIBBLE, 버추얼 팬덤 슈퍼앱',
    category: 'dev',
    status: 'ACTIVE 연구개발',
    statusClass: 'active',
    desc: '채팅, 쇼핑, 가상 아바타 제어 및 실시간 뼈대 동기화 웹소켓 모듈이 융합된 차세대 가상 팬덤 서비스.',
    tech: ['Flutter', 'Python FastAPI', 'Websockets'],
    glow: 'linear-gradient(135deg, rgba(191, 90, 242, 0.12) 0%, transparent 60%)'
  },
  {
    id: 2,
    title: 'RITUDY, 뽀모도로 몰입 타이머',
    category: 'dev',
    status: 'STABLE 서비스 중',
    statusClass: 'stable',
    desc: '독점 가상 재화 BPO 포인트 시스템 및 실시간 몰입 상태 보장을 위한 포그라운드 측정 기술 탑재 학습 솔루션.',
    tech: ['Flutter', 'SQLite', 'Local Push'],
    glow: 'linear-gradient(135deg, rgba(48, 209, 88, 0.12) 0%, transparent 60%)'
  },
  {
    id: 3,
    title: '성북구 관공서 비주얼 리브랜딩',
    category: 'design',
    status: 'COMPLETED 연구 완료',
    statusClass: 'completed',
    desc: '전통 역사와 스마트 시티 계획의 융합을 형상화한 둥근 캡슐형 아이덴티티 및 브랜딩 가이드 설계.',
    tech: ['Figma', 'Vector Graphic', 'Brand System'],
    glow: 'linear-gradient(135deg, rgba(255, 41, 151, 0.12) 0%, transparent 60%)'
  },
  {
    id: 4,
    title: '티머니GO 모바일 앱 UI/UX 개선',
    category: 'design',
    status: 'COMPLETED 연구 완료',
    statusClass: 'completed',
    desc: '복잡한 메뉴 구조를 개편하고 모바일 한 손 파지 조작에 최적화된 플로팅 캡슐 내비게이션 UI 디자인.',
    tech: ['UI/UX Redesign', 'Capsule Layout', 'High-Fi Prototyping'],
    glow: 'linear-gradient(135deg, rgba(255, 159, 10, 0.12) 0%, transparent 60%)'
  },
  {
    id: 5,
    title: 'VONRI AIR 버추얼 항공 ASMR 콘텐츠',
    category: 'media',
    status: 'STABLE 방송 송출',
    statusClass: 'stable',
    desc: '공간적 힐링 여정과 오디오 ASMR 사운드 스트리밍 기술을 결합한 버추얼 항공 Transit 콘텐츠 플랫폼.',
    tech: ['Transit Media', 'Audio ASMR', 'Streaming System'],
    glow: 'linear-gradient(135deg, rgba(41, 151, 255, 0.12) 0%, transparent 60%)'
  },
  {
    id: 6,
    title: 'STUDIO Peng1 버추얼 음악 미디어',
    category: 'media',
    status: 'ACTIVE 연재 중',
    statusClass: 'active',
    desc: '독창적인 곡 배합 및 이세계아이돌 등 버추얼 아티스트 신곡을 다루는 디지털 미디어 플레이리스트 기획.',
    tech: ['Media Curation', 'Concept Design', 'YouTube Curation'],
    glow: 'linear-gradient(135deg, rgba(255, 213, 129, 0.12) 0%, transparent 60%)'
  }
];

export default function HomeTab() {
  const [filter, setFilter] = useState<'all' | 'dev' | 'design' | 'media'>('all');
  const router = useRouter();

  const filteredProjects = LAB_PROJECTS.filter(
    (project) => filter === 'all' || project.category === filter
  );

  return (
    <div className={`${styles.container} fade-in-up`}>
      
      {/* Background SVG Wave Lines (Scroll Drawing) */}
      <div className={styles.svgBackground}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="none" 
            stroke="rgba(255, 213, 129, 0.08)" 
            strokeWidth="2" 
            d="M0,96C180,160,360,64,540,112C720,160,900,224,1080,224C1260,224,1440,160,1440,160"
            className={styles.wavePath1}
          />
          <path 
            fill="none" 
            stroke="rgba(41, 151, 255, 0.08)" 
            strokeWidth="1.5" 
            d="M0,192C240,224,480,96,720,128C960,160,1200,288,1440,256"
            className={styles.wavePath2}
          />
        </svg>
      </div>

      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <FloatingSphere />
        
        <div className={styles.badge}>BEYOND FANTASIUM LAB</div>
        <h1 className={styles.title}>
          상상을 현실로,<br />
          <span>Beyond Fantasium</span>의 가치를 구축합니다.
        </h1>
        <p className={styles.subtitle}>
          BF YOONSEUL은 Beyond Fantasium의 공식 프로젝트 연구소로서 기획, 디자인, 기술 융합을 통해 세상을 이롭게 하는 디지털 빛(윤슬)을 만들어냅니다.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#lab-showcase" className="capsule-button">프로젝트 연구소 보기</a>
          <a href="#about-yoonseul" className="capsule-button-outline">윤슬 소개 & 가치</a>
        </div>
      </section>

      {/* 2. Brand Vision Section (Spacious & Minimal) */}
      <section id="about-yoonseul" className={styles.visionSection}>
        <span className={styles.badgeLabel}>OUR VISION</span>
        <h2 className={styles.visionTitle}>
          세상을 이롭게 하는 잔물결,<br />
          디지털 바다 위에 <span>윤슬</span>을 그리다.
        </h2>
        <p className={styles.visionText}>
          '윤슬'은 햇빛이나 달빛에 비치어 반짝이는 잔물결을 뜻합니다. 우리는 일시적인 유행이나 거대한 파도에 휩쓸리기보다, 비즈니스와 일상 속에 잔잔하면서도 깊은 울림의 반짝임을 선사하고자 합니다.
        </p>
      </section>

      {/* 3. Core Identity Pillars (3대 핵심 축) */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>01</span>
            <h3 className={styles.pillarTitle}>Beyond Fantasium R&D 기지</h3>
            <p className={styles.pillarDesc}>
              모회사 'Beyond Fantasium'의 미래 지향적인 IT 프로젝트들을 주도적으로 실험하고 검증하는 R&D 프로젝트 연구소입니다.
            </p>
          </div>
          
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>02</span>
            <h3 className={styles.pillarTitle}>Seamless Convergence</h3>
            <p className={styles.pillarDesc}>
              기획 단계의 논리, UI/UX 디자인의 심미성, Flutter/Python 기반의 고성능 구현까지 단절 없이 하나로 흐르는 유기적 가치를 추구합니다.
            </p>
          </div>

          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>03</span>
            <h3 className={styles.pillarTitle}>Transit & Media Innovation</h3>
            <p className={styles.pillarDesc}>
              지루하게 흐를 수 있는 이동 경로(Transit)나 공간적 경험을 버추얼 ASMR(VONRI AIR) 및 차세대 미디어 스트리밍 생태계로 치유합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3.5. Detailed Corporate Value (상세 회사 소개) */}
      <section className={styles.detailCompanySection}>
        <div className={styles.companyGrid}>
          <div className={styles.companyLeft}>
            <span className={styles.badgeLabel}>HOW WE WORK</span>
            <h3 className={styles.companyMainTitle}>
              우리는 아이디어에 머무르지 않고, <br />
              실제로 <span>작동하는 가치</span>를 빌드합니다.
            </h3>
            <p className={styles.companySubText}>
              BF YOONSEUL은 단순한 외주 용역 개발사나 시안용 디자인 에이전시가 아닙니다. 우리는 Beyond Fantasium의 R&D 허브로서, 비즈니스의 근본적인 문제를 정의하고 이를 사용자 경험의 디테일과 견고한 기술 아키텍처로 증명해 냅니다.
            </p>
          </div>
          <div className={styles.companyRight}>
            <div className={styles.introBlock}>
              <h4>디테일에 집착하는 프리미엄 엔지니어링</h4>
              <p>
                0.1초의 레이턴시를 줄이기 위한 Websocket 실시간 동기화 모듈 개발, 프레임 드랍 방지를 위한 뼈대 보간 알고리즘, 앱 이탈 상황에서도 안정적으로 작동하는 백그라운드 포그라운드 정밀 시간 측정 기술 등 사용자 인터랙션의 극대화에 집중합니다.
              </p>
            </div>
            <div className={styles.introBlock}>
              <h4>브랜드의 영혼을 시각화하는 디자인 시스템</h4>
              <p>
                아크릴모피즘과 글래스모피즘을 접목한 독창적인 모바일/웹 UI 레이아웃 가이드를 구축합니다. 일회성 그래픽이 아닌, 명함부터 홍보용 매체까지 하나의 둥근 캡슐 인터페이스 조형 언어로 관통되는 통일된 디자인 시스템을 설계합니다.
              </p>
            </div>
            <div className={styles.introBlock}>
              <h4>가상 세계와 일상을 잇는 플랫폼 설계</h4>
              <p>
                버추얼 크리에이터 스트리밍 플랫폼과 연계된 몰입 솔루션 RITUDY 및 자체 가상 재화 BPO 시스템을 통해, 사용자가 만들어내는 디지털 자산이 실생활과 가상 팬덤 생태계(RIBBLE)에 유기적으로 연결되도록 블록 단위 아키텍처를 설계합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.6. Timeline / Milestones (분리된 카드 레이아웃으로 변경) */}
      <section className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.badgeLabel}>OUR JOURNEY</span>
          <h2 className={styles.sectionTitle}>연구소 성장 마일스톤</h2>
          <p className={styles.sectionSubtitle}>
            가상 음악 콘텐츠의 크리에이티브 단계에서부터 IT 서비스 기획 및 제작·운영의 전문 기업으로 성장하기까지의 궤적입니다.
          </p>
        </div>
        
        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine} />
          
          {/* Year 2026 */}
          <div className={styles.timelineItem}>
            <div className={styles.timelineYear}>2026</div>
            <div className={styles.timelineCards}>
              
              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>CORPORATE</span>
                <h4>'BF YOONSEUL' 독립 부서 출범</h4>
                <p>RJ Music으로부터 콘텐츠 제작 및 IT 서비스 개발·운영 사업부를 분리 독립하여 전문 브랜드 BF YOONSEUL을 정식 출범시켰습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>LAUNCH</span>
                <h4>몰입 타이머 'RITUDY' 정식 출시</h4>
                <p>독점 가상 재화 BPO 포인트를 적용하고 SQLite 및 백그라운드 몰입 유효성 타이머 측정을 결합한 RITUDY 앱을 성공적으로 시장에 출시했습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>R&D RESURRECTION</span>
                <h4>'RIBBLE' 가상 팬덤 플랫폼 부활</h4>
                <p>가상 팬덤 통합 서비스 구축을 위해 기존 VMU 프로젝트를 전면 부활 및 고도화하여 서비스명 RIBBLE로의 전환과 신규 R&D에 진입했습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>REBRANDING</span>
                <h4>'본리에어(VONRI AIR)' 리브랜딩</h4>
                <p>디렉토리 서비스 STUDIO Peng1 Deep Dive 채널의 브랜딩 정체성을 새롭게 정립하여 가상 항공 Transit 콘텐츠 전문 브랜드 본리에어로 성공적으로 개편했습니다.</p>
              </div>

            </div>
          </div>

          {/* Year 2025 */}
          <div className={styles.timelineItem}>
            <div className={styles.timelineYear}>2025</div>
            <div className={styles.timelineCards}>
              
              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>R&D PIVOT</span>
                <h4>'VMU' 초기 설계 및 잠정 연구 보류</h4>
                <p>버추얼 팬덤 커뮤니티 VMU 서비스 기획을 마쳤으나, 플랫폼 제작 경험의 깊이 보완 및 UI/UX 디자인 연구 고도화의 필요성을 느끼고 R&D 보완 단계로 전환했습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>NEW CHANNEL</span>
                <h4>미디어 채널 'V:VERSE' 개설</h4>
                <p>버추얼 음악 큐레이션 및 소셜 미디어를 타겟으로 한 디지털 미디어 채널 V:VERSE를 신규 기획 및 런칭했습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>DESIGN BRANDING</span>
                <h4>'STUDIO Peng1' 리브랜딩 참여</h4>
                <p>가상 크리에이티브 콘텐츠를 연결하기 위해 STUDIO Peng1 채널의 인터페이스 디자인 개편 및 리브랜딩 전략 가이드 조율에 기여했습니다.</p>
              </div>

            </div>
          </div>

          {/* Year 2024 */}
          <div className={styles.timelineItem}>
            <div className={styles.timelineYear}>2024</div>
            <div className={styles.timelineCards}>
              
              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>SPAWN</span>
                <h4>콘텐츠 스튜디오 'RJ Music' 출범</h4>
                <p>유튜브 콘텐츠 제작 및 음악 큐레이션 전문 제작 그룹 RJ Music을 출범하며 최초의 브랜드 시동을 걸었습니다.</p>
              </div>

              <div className={`${styles.timelineCard} acrylic-card`}>
                <span className={styles.tagLabel}>PARTNERSHIP</span>
                <h4>'STUDIO Peng1' 채널 합류</h4>
                <p>음악 및 콘텐츠 배포를 강화하고 IT 기술을 연계하기 위해 STUDIO Peng1의 디자인 및 콘텐츠 R&D 파트너쉽으로 전격 합류했습니다.</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. Portfolio Showcase Grid (기업 프로젝트 연구소 - 2열 큼직한 레이아웃) */}
      <section id="lab-showcase" className={styles.portfolioSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.badgeLabel}>PROJECT SHOWCASE</span>
          <h2 className={styles.sectionTitle}>기업 프로젝트 연구소</h2>
          <p className={styles.sectionSubtitle}>
            개발, 디자인, 미디어 기술을 융합하여 다양한 분야에서 시도하고 검증해 낸 BF YOONSEUL의 연구 자산입니다.
          </p>
        </div>

        {/* Tab Filters */}
        <div className={styles.filterContainer}>
          <div className={styles.filterCapsule}>
            {(['all', 'dev', 'design', 'media'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' && '전체 보기'}
                {cat === 'dev' && '💻 개발 (Dev)'}
                {cat === 'design' && '🎨 디자인 (Design)'}
                {cat === 'media' && '🎬 미디어 (Media)'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Items */}
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <div key={project.id} className={`${styles.projectCard} acrylic-card`}>
              <div className={styles.cardBacklight} style={{ background: project.glow }} />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.statusBadge} ${styles[project.statusClass]}`}>
                    {project.status}
                  </span>
                  <span className={styles.categoryLabel}>
                    {project.category === 'dev' && 'DEVELOPMENT'}
                    {project.category === 'design' && 'UI/UX DESIGN'}
                    {project.category === 'media' && 'TRANSIT / MEDIA'}
                  </span>
                </div>
                
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.desc}</p>
                
                <div className={styles.techTags}>
                  {project.tech.map((t, idx) => (
                    <span key={idx} className={styles.techTag}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Core Services (역량 증명 - 큼직한 2열 + 하단 와이드 레이아웃) */}
      <section id="core-services" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.badgeLabel}>EXPERTISE & CAPABILITY</span>
          <h2 className={styles.sectionTitle}>핵심 서비스 영역</h2>
          <p className={styles.sectionSubtitle}>
            기획부터 다이내믹한 개발, 트렌디한 디자인 시스템 구축까지 성공적인 비즈니스를 지원하는 3대 솔루션입니다.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {/* Card 1: 앱 개발 */}
          <div className={`${styles.serviceCard} acrylic-card`}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.8" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3>앱/웹 솔루션 개발</h3>
            <p>
              아이디어를 실제로 동작하는 모바일 앱이나 웹 서비스로 구현합니다. 사용성과 직관적인 기능 작동에 집중하여 가볍고 실용적인 제품을 만들어냅니다.
            </p>
          </div>

          {/* Card 2: UI/UX 디자인 */}
          <div className={`${styles.serviceCard} acrylic-card`}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.8" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                <path d="M12 2v4"></path>
                <path d="M12 18v4"></path>
                <path d="M4.93 4.93l2.83 2.83"></path>
                <path d="M16.24 16.24l2.83 2.83"></path>
                <path d="M2 12h4"></path>
                <path d="M18 12h4"></path>
                <path d="M4.93 19.07l2.83-2.83"></path>
                <path d="M16.24 7.76l2.83-2.83"></path>
              </svg>
            </div>
            <h3>UI/UX & 브랜드 디자인</h3>
            <p>
              글래스모피즘과 아크릴모피즘을 접목한 독창적이고 심미적인 레이아웃을 구축합니다. 사용자 중심의 반응형 인터페이스와 모바일 최적화 캡슐 디자인 시스템을 제안합니다.
            </p>
          </div>

          {/* Card 3: Transit/Media 콘텐츠 개발 (Span Across) */}
          <div className={`${styles.serviceCard} ${styles.serviceCardWide} acrylic-card`}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <div className={styles.serviceWideContent}>
              <h3>Transit / Media 콘텐츠 개발</h3>
              <p>
                공간과 이동을 감성으로 채우는 버추얼 Transit 콘텐츠(VONRI AIR) 브랜딩, 독창적인 음원 스트리밍 큐레이션 및 소셜 미디어를 타겟으로 한 디지털 콘텐츠 생태계를 다각도로 기획합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action (문의 탭 링크용 거대한 카드) */}
      <section id="contact-cta" className={styles.contactSection}>
        <div 
          className={`${styles.contactCardLink} acrylic-card`}
          onClick={() => router.push('/?tab=contact')}
        >
          <div className={styles.contactCardGlow} />
          <div className={styles.contactCardContent}>
            <span className={styles.badgeLabel}>GET IN TOUCH</span>
            <h2 className={styles.contactCardTitle}>
              BF YOONSEUL과 함께<br />
              새로운 미래를 빌드해 보세요. <span>협업 문의하기 ➔</span>
            </h2>
            <p className={styles.contactCardDesc}>
              프로젝트 기획 제안, 브랜드 디자인 및 콘텐츠 기획 등 다양한 협업 상담이 가능합니다. 클릭하시면 문의 접수 페이지로 연결됩니다.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
