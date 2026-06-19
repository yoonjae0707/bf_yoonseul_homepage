'use client';

import React, { useState } from 'react';
import styles from './ContactTab.module.css';

export default function ContactTab() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'sending'>('idle');

  const emailAddress = 'contact@bf-yoonseul.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('필수 입력 항목을 입력해 주세요.');
      return;
    }
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className={`${styles.container} fade-in-up`}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.badge}>GET IN TOUCH</div>
        <h2 className={styles.title}>협업 문의</h2>
        <p className={styles.subtitle}>
          새로운 프로젝트 기획, Flutter 앱 개발, 백엔드 서버 인프라 구축, UI/UX 브랜딩 디자인 등<br />
          BF YOONSEUL과의 협업 제안을 환영합니다.
        </p>
      </section>

      {/* Main Layout */}
      <div className={styles.contentLayout}>
        {/* Contact Info Card */}
        <div className={`${styles.infoCard} acrylic-card`}>
          <h3>Contact Info</h3>
          <p className={styles.infoDesc}>
            아래 이메일로 직접 문의하시거나, 우측의 폼을 통해 메시지를 남겨주시면 24시간 이내에 답변을 드리겠습니다.
          </p>

          <div className={styles.emailContainer}>
            <span className={styles.emailLabel}>Email Address</span>
            <div className={styles.emailRow}>
              <span className={styles.emailValue}>{emailAddress}</span>
              <button 
                onClick={copyEmail} 
                className={`${styles.copyBtn} capsule-button`}
                type="button"
              >
                {copied ? '복사 완료!' : '주소 복사'}
              </button>
            </div>
          </div>

          <div className={styles.otherContacts}>
            <div className={styles.contactItem}>
              <span>📞 Tel:</span>
              <p>+82 10-1234-5678 (임의 연락처)</p>
            </div>
            <div className={styles.contactItem}>
              <span>📍 Office:</span>
              <p>서울특별시 마포구 백범로 (임의 주소)</p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <form className={`${styles.formCard} acrylic-card`} onSubmit={handleSubmit}>
          <h3>Send a Message</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">성함 / 회사명 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일 주소 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">제목</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="협업 제안 건"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">문의 내용 *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="프로젝트 일정, 상세 요구사항 등을 적어주세요."
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} capsule-button`}
            disabled={status === 'sending'}
          >
            {status === 'sending' && '전송 중...'}
            {status === 'success' && '전송 완료! 감사합니다.'}
            {status === 'idle' && '문의 보내기'}
          </button>
        </form>
      </div>
    </div>
  );
}
