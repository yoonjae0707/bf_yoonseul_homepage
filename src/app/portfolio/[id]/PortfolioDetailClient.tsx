'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './portfolio.module.css';

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

interface PortfolioDetailClientProps {
  project: Project;
}

// Separate memoized PdfPage component to render canvas in isolation and optimize performance
interface PdfPageProps {
  pdfDoc: any;
  pageNumber: number;
  width: number;
  isVisible: boolean;
}

const PdfPage = React.memo(({ pdfDoc, pageNumber, width, isVisible }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendered, setRendered] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!hasBeenVisible || !pdfDoc) return;

    let isCancelled = false;
    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const baseViewport = page.getViewport({ scale: 1.0 });
        // Scale viewport based on container width
        const scale = width / baseViewport.width;
        // Render viewport with slightly higher scale for crisp high-DPI display
        const viewport = page.getViewport({ scale: scale * 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
        if (!isCancelled) {
          setRendered(true);
        }
      } catch (err) {
        console.error(`Page ${pageNumber} rendering error:`, err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, width, hasBeenVisible]);

  return (
    <div className={styles.pdfCanvasBox} onDragStart={(e) => e.preventDefault()}>
      <canvas 
        ref={canvasRef} 
        className={styles.pdfCanvas}
        style={{
          opacity: rendered ? 1 : 0.6,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
});

PdfPage.displayName = 'PdfPage';

// Simple custom Markdown renderer to parse basic formatting (headings, lists, rules, bold text)
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

export default function PortfolioDetailClient({ project }: PortfolioDetailClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    // Measure if content exceeds collapsed height (280px)
    if (descriptionRef.current) {
      if (descriptionRef.current.scrollHeight > 280) {
        setShowReadMore(true);
      } else {
        setShowReadMore(false);
      }
    }
  }, [project.longDescription]);

  // Generate dynamic mockup slides based on the project content
  const mockSlides = [
    {
      title: project.title,
      text: `${project.description}\n\n[BF YOONSEUL 프리미엄 포트폴리오 가이드라인]`,
      bg: project.imageGlow,
    },
    {
      title: "01. 전략 및 서비스 컨셉",
      text: `본 프로젝트는 사용자 분석 및 UX 리서치를 바탕으로 기획되었습니다. 핵심 타겟의 페르소나 행동 양식을 분석하고, 직관적이면서 사용하기 편리한 플로팅 요소와 둥글둥글한 레이아웃 컨셉을 도입했습니다.`,
      bg: "linear-gradient(135deg, #bf5af2, #5e5ce6)",
    },
    {
      title: "02. 시스템 아키텍처 및 디자인",
      text: `기술 스택: ${project.tags.join(', ')}\n\n심미성과 기능성을 극대화하기 위해 아크릴모피즘 카드와 입체적인 그림자 시스템을 접목했습니다. 로컬 디바이스 최적화 및 경량화 아키텍처를 설계하여 압도적으로 빠른 반응 속도를 보장합니다.`,
      bg: "linear-gradient(135deg, #30d158, #0071e3)",
    },
    {
      title: "03. 기대 효과 및 비즈니스 모델",
      text: `심리스한 사용성 개선을 통해 핵심 이탈률을 낮추고 기존 대비 전환율 상승을 설계했습니다. 확장성 있는 모듈형 컴포넌트 설계로 추후 부가 서비스 확장이 매우 용이한 비즈니스 모델을 구체화했습니다.`,
      bg: project.imageGlow,
    }
  ];

  // Helper to determine if we should show iframe (live link or PDF) or simulated slide webview
  const hasDemo = project.demoLink && project.demoLink !== '#' && project.demoLink !== '';
  const hasPdfProposal = project.proposalLink && project.proposalLink !== '#' && project.proposalLink !== '' && project.proposalLink.toLowerCase().endsWith('.pdf');

  const useSimulatedPreview = !hasDemo && !hasPdfProposal;
  
  const displayUrl = hasDemo 
    ? project.demoLink
    : hasPdfProposal 
      ? `https://yoonseul.dev/portfolio/proposal/${project.id}.pdf`
      : `https://yoonseul.dev/portfolio/view/${project.id}`;

  const iframeSrc = hasDemo 
    ? project.demoLink 
    : '';

  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Swipe & Drag Gesture States
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);

  // ResizeObserver to track clientWidth of layout column dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Subtract horizontal padding if needed, but containerRect.width is perfect
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const total = hasPdfProposal ? numPages : mockSlides.length;
      if (e.key === 'ArrowRight') {
        if (currentSlide < total - 1) {
          setCurrentSlide((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          setCurrentSlide((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, numPages, hasPdfProposal, mockSlides.length]);

  // Dynamic loader for pdf.js CDN script
  useEffect(() => {
    if (!hasPdfProposal) return;

    let isMounted = true;

    const loadPdfJs = async () => {
      // Check if already loaded
      if ((window as any).pdfjsLib) {
        initPdf((window as any).pdfjsLib);
        return;
      }

      setPdfLoading(true);

      // Create Script
      let script = document.getElementById('pdfjs-script') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'pdfjs-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.async = true;
        document.body.appendChild(script);
      }

      script.onload = () => {
        if ((window as any).pdfjsLib && isMounted) {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
          initPdf((window as any).pdfjsLib);
        }
      };

      script.onerror = () => {
        if (isMounted) {
          setPdfError('PDF 라이브러리를 로드하는 데 실패했습니다.');
          setPdfLoading(false);
        }
      };
    };

    const initPdf = async (pdfjs: any) => {
      try {
        const loadingTask = pdfjs.getDocument(project.proposalLink);
        const pdf = await loadingTask.promise;
        if (isMounted) {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setCurrentSlide(0);
        }
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        if (isMounted) {
          setPdfError('PDF 문서를 변환해 가져오지 못했습니다. 파일 링크를 확인해주세요.');
        }
      } finally {
        if (isMounted) {
          setPdfLoading(false);
        }
      }
    };

    loadPdfJs();

    return () => {
      isMounted = false;
    };
  }, [project.proposalLink, hasPdfProposal]);

  const nextSlide = () => {
    const total = hasPdfProposal ? numPages : mockSlides.length;
    if (currentSlide < total - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Common Touch/Mouse Handlers for side-flipping sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    dragCurrentX.current = e.touches[0].clientX;
    const diff = dragCurrentX.current - dragStartX.current;
    
    const total = hasPdfProposal ? numPages : mockSlides.length;
    const isAtStart = currentSlide === 0 && diff > 0;
    const isAtEnd = currentSlide === total - 1 && diff < 0;

    // Apply elasticity/damping at boundaries
    if (isAtStart || isAtEnd) {
      setDragOffset(diff * 0.35);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragCurrentX.current - dragStartX.current;
    setDragOffset(0);

    const total = hasPdfProposal ? numPages : mockSlides.length;
    const threshold = 60; // swipe threshold in px
    if (diff > threshold && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else if (diff < -threshold && currentSlide < total - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only drag with left mouse click
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragCurrentX.current = e.clientX;
    const diff = dragCurrentX.current - dragStartX.current;

    const total = hasPdfProposal ? numPages : mockSlides.length;
    const isAtStart = currentSlide === 0 && diff > 0;
    const isAtEnd = currentSlide === total - 1 && diff < 0;

    if (isAtStart || isAtEnd) {
      setDragOffset(diff * 0.35);
    } else {
      setDragOffset(diff);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragCurrentX.current - dragStartX.current;
    setDragOffset(0);

    const total = hasPdfProposal ? numPages : mockSlides.length;
    const threshold = 60;
    if (diff > threshold && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else if (diff < -threshold && currentSlide < total - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <div className={styles.gridContent}>
      {/* Left Column: Story & Webview Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', minWidth: 0 }}>
        
        {/* Description Box */}
        <div className={styles.descriptionBox}>
          <h2>Project Overview</h2>
          <div style={{ position: 'relative' }}>
            <div 
              ref={descriptionRef}
              className={`${styles.descriptionBody} ${isExpanded ? styles.expanded : styles.collapsed}`}
            >
              <MarkdownRenderer content={project.longDescription} />
            </div>
            
            {showReadMore && !isExpanded && (
              <div className={styles.readMoreOverlay}>
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="capsule-button"
                  style={{ padding: '10px 24px', fontSize: '0.9rem', width: 'auto' }}
                  type="button"
                >
                  더 보기 ▼
                </button>
              </div>
            )}
            
            {showReadMore && isExpanded && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="capsule-button-outline"
                  style={{ padding: '10px 24px', fontSize: '0.9rem', width: 'auto' }}
                  type="button"
                >
                  접기 ▲
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Embedded Webview Container */}
        <div className={styles.previewSection}>
          <h2>{hasPdfProposal ? "기획서 제안서 (Presentation)" : "Live Preview & Interactive Webview"}</h2>
          
          {hasPdfProposal ? (
            /* Secure PDF Canvas Slide Viewer - Borderless, Large & Side-Flipping */
            <div 
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none', WebkitUserSelect: 'none', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {pdfLoading && <div className={styles.pdfLoader}>PDF 문서를 렌더링 중...</div>}
              {pdfError && <div className={styles.pdfError}>{pdfError}</div>}
              
              {!pdfLoading && !pdfError && pdfDoc && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  {/* Slider Wrapper */}
                  <div 
                    ref={containerRef}
                    className={styles.pdfSliderContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      className={styles.pdfSliderTrack}
                      style={{
                        transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {Array.from({ length: numPages }).map((_, index) => (
                        <div 
                          key={index} 
                          className={styles.pdfSlide}
                          style={{
                            opacity: Math.abs(currentSlide - index) <= 1 ? 1 : 0.05,
                            transition: 'opacity 0.4s ease'
                          }}
                        >
                          <PdfPage 
                            pdfDoc={pdfDoc} 
                            pageNumber={index + 1} 
                            width={containerWidth} 
                            isVisible={Math.abs(currentSlide - index) <= 1}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Floating Side Arrow buttons on Hover */}
                    <button 
                      className={`${styles.arrowBtn} ${styles.prevArrow}`}
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      type="button"
                      aria-label="Previous Page"
                    >
                      ←
                    </button>
                    <button 
                      className={`${styles.arrowBtn} ${styles.nextArrow}`}
                      onClick={nextSlide}
                      disabled={currentSlide === numPages - 1}
                      type="button"
                      aria-label="Next Page"
                    >
                      →
                    </button>
                  </div>
                  
                  {/* Controls below the canvas */}
                  <div className={styles.pdfControls}>
                    <span className={styles.slideNum}>
                      PAGE {currentSlide + 1} / {numPages}
                    </span>
                    <div className={styles.slideNav}>
                      <button 
                        onClick={prevSlide} 
                        disabled={currentSlide === 0}
                        className={styles.navBtn}
                        type="button"
                        aria-label="Previous Page"
                      >
                        ←
                      </button>
                      <button 
                        onClick={nextSlide} 
                        disabled={currentSlide === numPages - 1}
                        className={styles.navBtn}
                        type="button"
                        aria-label="Next Page"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {/* Dot navigation */}
                  <div className={styles.dotsContainer}>
                    {Array.from({ length: numPages }).map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        type="button"
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* Browser mockup for live site demo & simulated fallback */
            <div className={styles.browserFrame}>
              {/* Browser Topbar */}
              <div className={styles.browserHeader}>
                <div className={styles.windowDots}>
                  <span className={`${styles.dot} ${styles.dotRed}`} />
                  <span className={`${styles.dot} ${styles.dotYellow}`} />
                  <span className={`${styles.dot} ${styles.dotGreen}`} />
                </div>
                <div className={styles.addressBar}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span>{displayUrl}</span>
                </div>
              </div>


              {/* Browser Body */}
              <div className={styles.browserBody}>
                {useSimulatedPreview ? (
                  /* Simulated Presentation / Document Webview Fallback - Sliding version */
                  <div 
                    className={styles.fallbackSliderContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      className={styles.fallbackSliderTrack}
                      style={{
                        transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {mockSlides.map((slide, index) => (
                        <div key={index} className={styles.fallbackMockup}>
                          <div className={styles.slidePageGlow} style={{ background: slide.bg, top: '20%', left: '30%' }} />
                          
                          <div className={styles.mockupHeader}>
                            <span className={styles.mockupTitle}>{project.title}</span>
                            <span className={styles.mockupBadge}>PREVIEW INTERACTIVE</span>
                          </div>

                          <div className={styles.mockupSlideContent}>
                            <h3 className={styles.slideHeading}>{slide.title}</h3>
                            <p className={styles.slideText}>{slide.text}</p>
                          </div>

                          <div className={styles.mockupControls}>
                            <span className={styles.slideNum}>PAGE {index + 1} / {mockSlides.length}</span>
                            <div className={styles.slideNav}>
                              <button 
                                onClick={prevSlide} 
                                disabled={currentSlide === 0}
                                className={styles.navBtn}
                                type="button"
                                aria-label="Previous Page"
                              >
                                ←
                              </button>
                              <button 
                                onClick={nextSlide} 
                                disabled={currentSlide === mockSlides.length - 1}
                                className={styles.navBtn}
                                type="button"
                                aria-label="Next Page"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Floating Side Arrow buttons on Hover */}
                    <button 
                      className={`${styles.arrowBtn} ${styles.prevArrow}`}
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      type="button"
                      aria-label="Previous Page"
                    >
                      ←
                    </button>
                    <button 
                      className={`${styles.arrowBtn} ${styles.nextArrow}`}
                      onClick={nextSlide}
                      disabled={currentSlide === mockSlides.length - 1}
                      type="button"
                      aria-label="Next Page"
                    >
                      →
                    </button>
                  </div>
                ) : (
                  /* Live iframe */
                  <iframe 
                    src={iframeSrc} 
                    title={project.title} 
                    className={styles.iframe} 
                  />
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Project Metadata Card */}
      <div style={{ minWidth: 0 }}>
        <div className={`${styles.metaInfoCard} acrylic-card`}>
          <h3>Project Specification</h3>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue} style={{ textTransform: 'uppercase' }}>
              {project.category === 'all' ? 'All-Rounder' : project.category}
            </span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Representative Director</span>
            <span className={styles.metaValue}>소윤재</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Brand Partner</span>
            <span className={styles.metaValue}>BF YOONSEUL</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tech & Skills</span>
            <span className={styles.metaValue}>{project.tags.join(', ')}</span>
          </div>

          {/* Action Links */}
          <div className={styles.linksList}>
            {project.demoLink && project.demoLink !== '#' && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="capsule-button" style={{ width: '100%' }}>
                데모 사이트 방문
              </a>
            )}
            {project.proposalLink && project.proposalLink !== '#' && (
              hasPdfProposal ? (
                <div style={{ 
                  background: 'rgba(255, 213, 129, 0.06)', 
                  border: '1px solid rgba(255, 213, 129, 0.2)', 
                  borderRadius: '12px', 
                  padding: '14px 16px', 
                  fontSize: '0.82rem', 
                  color: 'var(--accent)', 
                  lineHeight: '1.45', 
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  🔒 본 제안서는 무단 복제 및 전재 방지를 위해 웹 뷰어로만 제공되며 다운로드가 불가합니다.
                </div>
              ) : (
                <a href={project.proposalLink} target="_blank" rel="noopener noreferrer" className="capsule-button-outline" style={{ width: '100%' }}>
                  제안서 다운로드
                </a>
              )
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="capsule-button-outline" style={{ width: '100%', justifyContent: 'center' }}>
                GitHub 소스코드
              </a>
            )}
          </div>
        </div>

        <div className={styles.backBtnWrapper}>
          <Link href="/?tab=portfolio" className="capsule-button-outline" style={{ width: '100%', textAlign: 'center' }}>
            ← 포트폴리오 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
