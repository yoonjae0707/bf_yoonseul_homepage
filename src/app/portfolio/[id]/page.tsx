import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PortfolioDetailClient from './PortfolioDetailClient';
import dbData from '@/data/db.json';
import styles from './portfolio.module.css';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'brand', label: 'Brand' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'content', label: 'Content' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'contact', label: 'Contact' },
];

export async function generateStaticParams() {
  return dbData.projects.map((p) => ({
    id: p.id.toString(),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id, 10);
  const project = dbData.projects.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  // Map database categories to Korean readable categories
  const categoryLabels = {
    planning: 'Service Planning & Strategy',
    design: 'UI/UX & Branding Design',
    dev: 'Full-Stack Development',
    all: 'All-Rounder Directing',
  };

  const mappedProject = {
    id: project.id,
    title: project.title,
    category: project.category as any,
    tags: Array.isArray(project.tags) ? project.tags : [],
    description: project.description,
    longDescription: project.long_description,
    proposalLink: project.proposal_link,
    demoLink: project.demo_link,
    githubLink: project.github_link,
    imageGlow: project.image_glow,
  };

  return (
    <div className={styles.container}>
      {/* Floating Header */}
      <Navbar activeTab="portfolio" tabs={TABS} />

      {/* Full screen Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.bgGlow} style={{ background: project.image_glow }} />
        
        <div className={styles.heroContent}>
          <span className={styles.catBadge}>{categoryLabels[project.category as keyof typeof categoryLabels]}</span>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.tags}>
            {project.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>SCROLL DOWN</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className={styles.detailSection}>
        <PortfolioDetailClient project={mappedProject} />
      </section>
    </div>
  );
}
