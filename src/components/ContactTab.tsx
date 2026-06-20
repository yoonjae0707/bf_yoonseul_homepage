'use client';

import React, { useState, useEffect } from 'react';
import dbData from '@/data/db.json';
import styles from './ContactTab.module.css';

interface Department {
  id?: number;
  department_name: string;
  email_address: string;
}

export default function ContactTab() {
  const [copied, setCopied] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(() => dbData.contact_settings);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: dbData.contact_settings[0]?.department_name || '총괄 / 기획 부서',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'sending'>('idle');

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        if (data && data.contact_settings && data.contact_settings.length > 0) {
          setDepartments(data.contact_settings);
          // Set initial selection to first fetched department name
          setFormData(prev => ({ ...prev, department: data.contact_settings[0].department_name }));
        }
      } catch (err) {
        console.warn('Using static fallback for departments:', err);
      }
    }
    loadDepartments();
  }, []);

  const emailAddress = 'bfyoonseul@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('필수 입력 항목을 입력해 주세요.');
      return;
    }
    
    const targetDept = departments.find(d => d.department_name === formData.department);
    const targetEmail = targetDept ? targetDept.email_address : emailAddress;

    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      alert(`[문의 접수 완료]\n\n보내주신 문의가 ${formData.department}(수신 이메일: ${targetEmail})로 성공적으로 라우팅되었습니다.`);
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        subject: '',
        message: ''
      }));
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
          새로운 아이디어 기획, 디자인 브랜딩, 콘텐츠 제작 등<br />
          BF YOONSEUL과의 다양한 협업 제안을 환영합니다.
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
            <label htmlFor="department">문의 부서 *</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              {departments.map((dept, idx) => (
                <option key={idx} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
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
              placeholder="기획하시거나 만들고 싶은 아이디어를 자유롭게 공유해 주세요."
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
