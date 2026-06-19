import React from 'react';
import styles from './HomeTab.module.css';

export default function HomeTab() {
  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>BF YOONSEUL</div>
        <h1 className={styles.title}>
          반짝이는 윤슬처럼,<br />
          <span>Brilliant Future</span>를 만듭니다.
        </h1>
        <p className={styles.subtitle}>
          '윤슬'은 햇빛이나 달빛에 비치어 반짝이는 잔물결을 뜻합니다.<br />
          BF YOONSEUL은 크리에이티브한 기획, 디자인, 그리고 견고한 기술력을 통해<br />
          비즈니스와 일상에 잔잔하지만 깊은 감동의 반짝임을 더하는 IT 파트너입니다.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#about" className="capsule-button">우리의 가치 보기</a>
          <a href="#services" className="capsule-button-outline">서비스 영역</a>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Core Expertise</h2>
        <div className={styles.grid}>
          {/* Card 1: 기획 */}
          <div className={`${styles.card} acrylic-card`}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>기획 (Strategy & Planning)</h3>
            <p>
              아이디어를 구조화하고 시장 흐름을 파악하여 실행 가능한 전략적 기획서를 작성합니다. 
              사용자 여정과 비즈니스 모델을 치밀하게 설계합니다.
            </p>
          </div>

          {/* Card 2: 디자인 */}
          <div className={`${styles.card} acrylic-card`}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
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
            <h3>디자인 (UI/UX & Branding)</h3>
            <p>
              아크릴모피즘과 미니멀한 터치를 기반으로, 심미성과 실용성을 모두 갖춘 디자인을 완성합니다. 
              브랜드의 영혼이 돋보이는 비주얼을 제공합니다.
            </p>
          </div>

          {/* Card 3: 개발 */}
          <div className={`${styles.card} acrylic-card`}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3>개발 (Flutter & Python)</h3>
            <p>
              Flutter를 이용해 모바일 및 웹 크로스플랫폼 앱을 개발하고, 
              Python 기반의 빠르고 견고한 백엔드 시스템 및 데이터 아키텍처를 구축합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className={styles.philosophy}>
        <div className={`${styles.philosophyCard} acrylic-card`}>
          <div className={styles.philosophyContent}>
            <h2>Shining Ripple in Digital</h2>
            <p>
              저희는 거대한 파도보다는 잔잔하게 일렁이며 눈길을 사로잡는 '윤슬' 같은 솔루션을 지향합니다.
              사용자가 머무는 곳곳에 세련되고 매끄러운(smooth) 인터페이스와 뛰어난 사용성을 채워, 
              브랜드의 가치가 가장 돋보이게 빛나도록 돕는 것이 우리의 미션입니다.
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <h4>Quality</h4>
                <p>Premium UI</p>
              </div>
              <div className={styles.statItem}>
                <h4>Cross-Platform</h4>
                <p>Flutter Dev</p>
              </div>
              <div className={styles.statItem}>
                <h4>Back-End</h4>
                <p>Python Architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
