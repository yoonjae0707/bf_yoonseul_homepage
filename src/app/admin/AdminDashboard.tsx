'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

interface Profile {
  id?: string;
  name: string;
  tagline: string;
  bio: string;
  badges: string[];
}

interface Brand {
  id?: number;
  name: string;
  type: 'CI' | 'BI';
  slogan: string;
  description: string;
  colors: { name: string; hex: string }[];
  typography: string;
  logo_shape: 'ripple' | 'tech' | 'studio';
  logo_color_glow: string;
  logo_url?: string;
}

interface Project {
  id?: number;
  title: string;
  category: 'planning' | 'design' | 'dev' | 'all';
  tags: string[];
  description: string;
  long_description: string;
  proposal_link?: string;
  demo_link?: string;
  github_link?: string;
  image_glow: string;
}

interface ContactSetting {
  id?: number;
  department_name: string;
  email_address: string;
}

interface ContentItem {
  id?: number;
  type: 'youtube' | 'instagram' | 'blog';
  title: string;
  thumbnail: string;
  stats: string;
  link: string;
  badge: string;
  colorGlow: string;
  videoId?: string;
  blogContent?: string;
}

interface NewsItem {
  id?: number;
  title: string;
  press: string;
  date: string;
  link: string;
  summary: string;
  content: string;
  colorGlow?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'brands' | 'projects' | 'contact' | 'contents' | 'newsroom'>('profile');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // States for database items
  const [profile, setProfile] = useState<Profile>({ name: '', tagline: '', bio: '', badges: [] });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSetting[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Editing forms states
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newDept, setNewDept] = useState({ department_name: '', email_address: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (err: any) {
      alert('파일 업로드 실패: ' + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (res.ok && data) {
        if (data.profile) setProfile(data.profile);
        if (data.brands) setBrands(data.brands);
        if (data.projects) setProjects(data.projects);
        if (data.contact_settings) setContactSettings(data.contact_settings);
        if (data.contents) setContents(data.contents);
        if (data.news) {
          const mappedNews = data.news.map((n: any) => ({
            ...n,
            thumbnailUrl: n.thumbnailUrl || n.thumbnail_url || '',
            thumbnail_url: n.thumbnailUrl || n.thumbnail_url || ''
          }));
          setNews(mappedNews);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  // Helper to save all data back to the server
  const saveAllData = async (updatedData: {
    profile: Profile;
    brands: Brand[];
    projects: Project[];
    contact_settings: ContactSetting[];
    contents: ContentItem[];
    news: NewsItem[];
  }) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save data');
      }
      return true;
    } catch (err: any) {
      alert('저장 중 오류가 발생했습니다: ' + err.message);
      return false;
    }
  };

  // --- CRUD Profile ---
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      profile,
      brands,
      projects,
      contact_settings: contactSettings,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      alert('프로필이 성공적으로 저장되었습니다!');
    }
  };

  // --- CRUD Brands ---
  const saveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    let updatedBrands = [...brands];
    if (editingBrand.id) {
      // Update
      updatedBrands = brands.map((b) => (b.id === editingBrand.id ? editingBrand : b));
    } else {
      // Insert (Assign new ID)
      const nextId = brands.length > 0 ? Math.max(...brands.map((b) => b.id || 0)) + 1 : 1;
      updatedBrands.push({ ...editingBrand, id: nextId });
    }

    const updated = {
      profile,
      brands: updatedBrands,
      projects,
      contact_settings: contactSettings,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setBrands(updatedBrands);
      alert(editingBrand.id ? '브랜드가 수정되었습니다.' : '새 브랜드가 추가되었습니다.');
      setEditingBrand(null);
    }
  };

  const deleteBrand = async (id: number) => {
    if (!confirm('정말 이 브랜드를 삭제하시겠습니까?')) return;
    const updatedBrands = brands.filter((b) => b.id !== id);

    const updated = {
      profile,
      brands: updatedBrands,
      projects,
      contact_settings: contactSettings,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setBrands(updatedBrands);
      alert('삭제 완료');
    }
  };

  // --- CRUD Projects ---
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updatedProjects = [...projects];
    if (editingProject.id) {
      // Update
      updatedProjects = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    } else {
      // Insert (Assign new ID)
      const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id || 0)) + 1 : 1;
      updatedProjects.push({ ...editingProject, id: nextId });
    }

    const updated = {
      profile,
      brands,
      projects: updatedProjects,
      contact_settings: contactSettings,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setProjects(updatedProjects);
      alert(editingProject.id ? '프로젝트가 수정되었습니다.' : '새 프로젝트가 추가되었습니다.');
      setEditingProject(null);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('정말 이 프로젝트를 삭제하시겠습니까?')) return;
    const updatedProjects = projects.filter((p) => p.id !== id);

    const updated = {
      profile,
      brands,
      projects: updatedProjects,
      contact_settings: contactSettings,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setProjects(updatedProjects);
      alert('삭제 완료');
    }
  };

  // --- CRUD Contact Settings ---
  const addDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.department_name || !newDept.email_address) return;

    const nextId = contactSettings.length > 0 ? Math.max(...contactSettings.map((c) => c.id || 0)) + 1 : 1;
    const updatedDepts = [...contactSettings, { ...newDept, id: nextId }];

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: updatedDepts,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setContactSettings(updatedDepts);
      setNewDept({ department_name: '', email_address: '' });
      alert('새 부서와 이메일이 추가되었습니다.');
    }
  };

  const deleteDept = async (id: number) => {
    if (!confirm('이 부서 연결을 삭제하시겠습니까?')) return;
    const updatedDepts = contactSettings.filter((c) => c.id !== id);

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: updatedDepts,
      contents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setContactSettings(updatedDepts);
      alert('삭제 완료');
    }
  };

  // --- CRUD Contents ---
  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    let updatedContents = [...contents];
    if (editingContent.id) {
      // Update
      updatedContents = contents.map((c) => (c.id === editingContent.id ? editingContent : c));
    } else {
      // Insert (Assign new ID)
      const nextId = contents.length > 0 ? Math.max(...contents.map((c) => c.id || 0)) + 1 : 1;
      updatedContents.push({ ...editingContent, id: nextId });
    }

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: contactSettings,
      contents: updatedContents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setContents(updatedContents);
      alert(editingContent.id ? '콘텐츠가 수정되었습니다.' : '새 콘텐츠가 추가되었습니다.');
      setEditingContent(null);
    }
  };

  const deleteContent = async (id: number) => {
    if (!confirm('정말 이 콘텐츠를 삭제하시겠습니까?')) return;
    const updatedContents = contents.filter((c) => c.id !== id);

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: contactSettings,
      contents: updatedContents,
      news,
    };
    const success = await saveAllData(updated);
    if (success) {
      setContents(updatedContents);
      alert('삭제 완료');
    }
  };

  // --- CRUD Newsroom ---
  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    let updatedNews = [...news];
    if (editingNews.id) {
      // Update
      updatedNews = news.map((n) => (n.id === editingNews.id ? editingNews : n));
    } else {
      // Insert (Assign new ID)
      const nextId = news.length > 0 ? Math.max(...news.map((n) => n.id || 0)) + 1 : 1;
      updatedNews.push({ ...editingNews, id: nextId });
    }

    const preparedNews = updatedNews.map((n) => ({
      ...n,
      thumbnailUrl: n.thumbnailUrl || n.thumbnail_url || '',
      thumbnail_url: n.thumbnailUrl || n.thumbnail_url || ''
    }));

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: contactSettings,
      contents,
      news: preparedNews,
    };
    const success = await saveAllData(updated);
    if (success) {
      setNews(preparedNews);
      alert(editingNews.id ? '보도자료가 수정되었습니다.' : '새 보도자료가 추가되었습니다.');
      setEditingNews(null);
    }
  };

  const deleteNews = async (id: number) => {
    if (!confirm('정말 이 보도자료를 삭제하시겠습니까?')) return;
    const updatedNews = news.filter((n) => n.id !== id);

    const updated = {
      profile,
      brands,
      projects,
      contact_settings: contactSettings,
      contents,
      news: updatedNews,
    };
    const success = await saveAllData(updated);
    if (success) {
      setNews(updatedNews);
      alert('삭제 완료');
    }
  };

  if (loading) {
    return <div className={styles.loading}>데이터베이스 연결 중...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>BF YOONSEUL 관리창</h1>
          <span className={styles.badge}>Master Control Panel</span>
        </div>
        <div className={styles.btnGroup}>
          <button className="capsule-button-outline" onClick={() => router.push('/')}>홈페이지 바로가기</button>
          <button className="capsule-button" onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      {/* Main Layout */}
      <div className={styles.dashboardLayout}>
        {/* Navigation Sidebar */}
        <aside className={`${styles.sidebar} acrylic-card`}>
          <button className={`${styles.sideBtn} ${activeTab === 'profile' ? styles.sideActive : ''}`} onClick={() => setActiveTab('profile')}>👤 개인 프로필 관리</button>
          <button className={`${styles.sideBtn} ${activeTab === 'brands' ? styles.sideActive : ''}`} onClick={() => setActiveTab('brands')}>🏷️ CI / BI 브랜드 관리</button>
          <button className={`${styles.sideBtn} ${activeTab === 'projects' ? styles.sideActive : ''}`} onClick={() => setActiveTab('projects')}>💻 포트폴리오 관리</button>
          <button className={`${styles.sideBtn} ${activeTab === 'contact' ? styles.sideActive : ''}`} onClick={() => setActiveTab('contact')}>✉️ 부서별 이메일 관리</button>
          <button className={`${styles.sideBtn} ${activeTab === 'contents' ? styles.sideActive : ''}`} onClick={() => setActiveTab('contents')}>🎬 콘텐츠 관리</button>
          <button className={`${styles.sideBtn} ${activeTab === 'newsroom' ? styles.sideActive : ''}`} onClick={() => setActiveTab('newsroom')}>📰 뉴스룸 관리</button>
        </aside>

        {/* Dynamic Content Panel */}
        <main className={styles.mainPanel}>
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} className={`${styles.formCard} acrylic-card`}>
              <h2>개인 프로필 설정</h2>
              <p>포트폴리오 화면 상단에 나열되는 정보 및 소개 내용을 수정합니다.</p>
              
              <div className={styles.formGroup}>
                <label>대표자 성함</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label>한줄 소개 슬로건</label>
                <input type="text" value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label>세부 소개글 (Bio)</label>
                <textarea rows={5} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label>역량 배지 (쉼표로 구분)</label>
                <input 
                  type="text" 
                  value={profile.badges.join(', ')} 
                  onChange={(e) => setProfile({ ...profile, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                  placeholder="Planning, Flutter Dev, Python Back-End"
                />
              </div>

              <button type="submit" className="capsule-button">프로필 저장하기</button>
            </form>
          )}

          {/* TAB 2: Brands */}
          {activeTab === 'brands' && (
            <div className={styles.tabContent}>
              {!editingBrand ? (
                <div className={styles.listSection}>
                  <div className={styles.sectionHeader}>
                    <h2>CI / BI 브랜드 리스트</h2>
                    <button className="capsule-button" onClick={() => setEditingBrand({ name: '', type: 'BI', slogan: '', description: '', colors: [], typography: '', logo_shape: 'ripple', logo_color_glow: '' })}>+ 새 브랜드 추가</button>
                  </div>
                  
                  <div className={styles.listGrid}>
                    {brands.map((brand) => (
                      <div key={brand.id} className={`${styles.listCard} acrylic-card`}>
                        <div className={styles.cardHeader}>
                          <span className={styles.typeTag}>{brand.type}</span>
                          <h3>{brand.name}</h3>
                        </div>
                        <p className={styles.cardSlogan}>"{brand.slogan}"</p>
                        <div className={styles.cardActions}>
                          <button className="capsule-button-outline" onClick={() => setEditingBrand(brand)}>수정</button>
                          <button className={`${styles.deleteBtn} capsule-button`} onClick={() => brand.id && deleteBrand(brand.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveBrand} className={`${styles.formCard} acrylic-card`}>
                  <h2>{editingBrand.id ? '브랜드 정보 수정' : '새 브랜드 등록'}</h2>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>브랜드 이름</label>
                      <input type="text" value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>브랜드 구분</label>
                      <select value={editingBrand.type} onChange={(e) => setEditingBrand({ ...editingBrand, type: e.target.value as 'CI' | 'BI' })}>
                        <option value="CI">CI (대표 기업 이미지)</option>
                        <option value="BI">BI (산하 부서/브랜드 이미지)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>슬로건</label>
                    <input type="text" value={editingBrand.slogan} onChange={(e) => setEditingBrand({ ...editingBrand, slogan: e.target.value })} required />
                  </div>

                  <div className={styles.formGroup}>
                    <label>설명</label>
                    <textarea rows={4} value={editingBrand.description} onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })} required />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>로고 디자인 형태</label>
                      <select value={editingBrand.logo_shape} onChange={(e) => setEditingBrand({ ...editingBrand, logo_shape: e.target.value as any })}>
                        <option value="ripple">Ripple (물결 윤슬)</option>
                        <option value="tech">Tech (3D 큐브)</option>
                        <option value="studio">Studio (교차 캡슐)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>로고 발광 색상 그라데이션</label>
                      <input type="text" value={editingBrand.logo_color_glow} onChange={(e) => setEditingBrand({ ...editingBrand, logo_color_glow: e.target.value })} placeholder="linear-gradient(135deg, #2997ff, #ff2997)" required />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>대표 타이포그래피 안내</label>
                    <input type="text" value={editingBrand.typography} onChange={(e) => setEditingBrand({ ...editingBrand, typography: e.target.value })} placeholder="Outfit / Inter (Bold & Clean)" required />
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '1rem', fontWeight: 800 }}>🎨 브랜드 컬러 팔레트 설정</label>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
                      브랜드 상세 제원에 나열될 컬러 칩 목록입니다. (예: Yoonseul Blue, #2997ff)
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(editingBrand.colors || []).map((color, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={color.name} 
                            placeholder="색상 이름 (예: Primary)"
                            onChange={(e) => {
                              const newColors = [...(editingBrand.colors || [])];
                              newColors[idx] = { ...newColors[idx], name: e.target.value };
                              setEditingBrand({ ...editingBrand, colors: newColors });
                            }}
                            required
                            style={{ flex: 2 }}
                          />
                          <input 
                            type="text" 
                            value={color.hex} 
                            placeholder="#ffffff"
                            onChange={(e) => {
                              const newColors = [...(editingBrand.colors || [])];
                              newColors[idx] = { ...newColors[idx], hex: e.target.value };
                              setEditingBrand({ ...editingBrand, colors: newColors });
                            }}
                            required
                            style={{ flex: 1, fontFamily: 'monospace' }}
                          />
                          <input 
                            type="color" 
                            value={color.hex.startsWith('#') && color.hex.length === 7 ? color.hex : '#ffffff'} 
                            onChange={(e) => {
                              const newColors = [...(editingBrand.colors || [])];
                              newColors[idx] = { ...newColors[idx], hex: e.target.value };
                              setEditingBrand({ ...editingBrand, colors: newColors });
                            }}
                            style={{ width: '42px', height: '42px', padding: '0', border: '1px solid var(--card-border)', cursor: 'pointer', borderRadius: '8px' }}
                          />
                          <button 
                            type="button" 
                            className={`${styles.deleteBtn} capsule-button`}
                            style={{ padding: '10px 16px', fontSize: '0.85rem', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => {
                              const newColors = (editingBrand.colors || []).filter((_, i) => i !== idx);
                              setEditingBrand({ ...editingBrand, colors: newColors });
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                      
                      <button 
                        type="button" 
                        className="capsule-button-outline"
                        style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem' }}
                        onClick={() => {
                          const newColors = [...(editingBrand.colors || []), { name: '', hex: '#ffffff' }];
                          setEditingBrand({ ...editingBrand, colors: newColors });
                        }}
                      >
                        + 색상 추가
                      </button>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>대표 로고 이미지 업로드 (선택)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingBrand({ ...editingBrand, logo_url: url });
                            }
                          }
                        }}
                      />
                      {editingBrand.logo_url && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                          업로드됨: {editingBrand.logo_url}
                        </span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label>또는 로고 이미지 URL 경로 입력</label>
                      <input 
                        type="text" 
                        value={editingBrand.logo_url || ''} 
                        onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })} 
                        placeholder="/uploads/... 또는 외부 이미지 주소" 
                      />
                    </div>
                  </div>

                  <div className={styles.btnGroup}>
                    <button type="submit" className="capsule-button">저장하기</button>
                    <button type="button" className="capsule-button-outline" onClick={() => setEditingBrand(null)}>취소</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Projects */}
          {activeTab === 'projects' && (
            <div className={styles.tabContent}>
              {!editingProject ? (
                <div className={styles.listSection}>
                  <div className={styles.sectionHeader}>
                    <h2>포트폴리오 프로젝트 리스트</h2>
                    <button className="capsule-button" onClick={() => setEditingProject({ title: '', category: 'dev', tags: [], description: '', long_description: '', image_glow: '' })}>+ 새 프로젝트 추가</button>
                  </div>

                  <div className={styles.listGrid}>
                    {projects.map((project) => (
                      <div key={project.id} className={`${styles.listCard} acrylic-card`}>
                        <div className={styles.cardHeader}>
                          <span className={styles.typeTag}>{project.category}</span>
                          <h3>{project.title}</h3>
                        </div>
                        <p className={styles.cardSlogan}>{project.description}</p>
                        <div className={styles.cardActions}>
                          <button className="capsule-button-outline" onClick={() => setEditingProject(project)}>수정</button>
                          <button className={`${styles.deleteBtn} capsule-button`} onClick={() => project.id && deleteProject(project.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProject} className={`${styles.formCard} acrylic-card`}>
                  <h2>{editingProject.id ? '프로젝트 수정' : '새 프로젝트 등록'}</h2>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>프로젝트 제목</label>
                      <input type="text" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>카테고리</label>
                      <select value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}>
                        <option value="planning">기획</option>
                        <option value="design">디자인</option>
                        <option value="dev">개발</option>
                        <option value="all">전체 (올라운더)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>태그 (쉼표로 구분)</label>
                      <input type="text" value={editingProject.tags.join(', ')} onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Flutter, Python, 기획" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>카드 발광 그라데이션 색상</label>
                      <input type="text" value={editingProject.image_glow} onChange={(e) => setEditingProject({ ...editingProject, image_glow: e.target.value })} placeholder="linear-gradient(135deg, #0071e3, #30d158)" required />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>간단한 리스트 설명</label>
                    <input type="text" value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} required />
                  </div>

                  <div className={styles.formGroup}>
                    <label>상세 페이지 설명 (마크다운 지원)</label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                      ## 제목, --- 구분선, - 리스트, **굵게** 등의 서식을 입력하여 프로젝트 상세 설명글을 풍부하게 작성할 수 있습니다.
                    </span>
                    <textarea 
                      rows={8} 
                      value={editingProject.long_description} 
                      onChange={(e) => setEditingProject({ ...editingProject, long_description: e.target.value })} 
                      placeholder="예시:&#10;## 프로젝트 소개&#10;본 프로젝트는...&#10;&#10;---&#10;## 주요 성과&#10;- 성능 50% 개선&#10;- **고해상도** 뷰어 탑재" 
                      required 
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>기획서 PDF 업로드 (선택)</label>
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingProject({ ...editingProject, proposal_link: url });
                            }
                          }
                        }}
                      />
                      {editingProject.proposal_link && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                          업로드됨: {editingProject.proposal_link}
                        </span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label>기획서 링크 (또는 PDF 업로드 경로)</label>
                      <input type="text" value={editingProject.proposal_link || ''} onChange={(e) => setEditingProject({ ...editingProject, proposal_link: e.target.value || undefined })} placeholder="#" />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>데모 사이트 링크 (선택)</label>
                      <input type="text" value={editingProject.demo_link || ''} onChange={(e) => setEditingProject({ ...editingProject, demo_link: e.target.value || undefined })} placeholder="#" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>GitHub 소스 링크 (선택)</label>
                      <input type="text" value={editingProject.github_link || ''} onChange={(e) => setEditingProject({ ...editingProject, github_link: e.target.value || undefined })} placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <div className={styles.btnGroup}>
                    <button type="submit" className="capsule-button">저장하기</button>
                    <button type="button" className="capsule-button-outline" onClick={() => setEditingProject(null)}>취소</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Contact Email Routing */}
          {activeTab === 'contact' && (
            <div className={styles.tabContent}>
              {/* Add Department Form */}
              <form onSubmit={addDept} className={`${styles.formCard} acrylic-card`}>
                <h2>새 이메일 연동 부서 추가</h2>
                <p>문의하기 폼에서 사용자가 선택할 연결 부서와 매핑할 실제 이메일을 설정합니다.</p>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>부서명</label>
                    <input type="text" value={newDept.department_name} onChange={(e) => setNewDept({ ...newDept, department_name: e.target.value })} placeholder="예: 개발 지원팀" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>매핑할 수신 이메일 주소</label>
                    <input type="email" value={newDept.email_address} onChange={(e) => setNewDept({ ...newDept, email_address: e.target.value })} placeholder="dev@bf-yoonseul.com" required />
                  </div>
                </div>
                <button type="submit" className="capsule-button">+ 연동 추가</button>
              </form>

              {/* Department Table List */}
              <div className={`${styles.listSection} acrylic-card`} style={{ padding: '30px', marginTop: '30px' }}>
                <h2>현재 부서별 연동 리스트</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>연동 부서 / 명칭</th>
                      <th>연결된 이메일 주소</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSettings.map((dept) => (
                      <tr key={dept.id}>
                        <td className={styles.deptName}>{dept.department_name}</td>
                        <td className={styles.deptEmail}>{dept.email_address}</td>
                        <td>
                          <button className={`${styles.deleteBtnTable}`} onClick={() => dept.id && deleteDept(dept.id)}>
                            연동 해제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Contents Manager */}
          {activeTab === 'contents' && (
            <div className={styles.tabContent}>
              {!editingContent ? (
                <div className={styles.listSection}>
                  <div className={styles.sectionHeader}>
                    <h2>🎬 크리에이티브 아카이브 콘텐츠 리스트</h2>
                    <button 
                      className="capsule-button" 
                      onClick={() => setEditingContent({ 
                        type: 'youtube', 
                        title: '', 
                        thumbnail: '', 
                        stats: '', 
                        link: '', 
                        badge: '', 
                        colorGlow: 'rgba(255, 213, 129, 0.15)', 
                        videoId: '' 
                      })}
                    >
                      + 새 콘텐츠 추가
                    </button>
                  </div>
                  
                  <div className={styles.listGrid}>
                    {contents.map((content) => (
                      <div key={content.id} className={`${styles.listCard} acrylic-card`}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.typeTag} ${content.type === 'youtube' ? styles.tagRed : styles.tagPink}`}>
                            {content.type.toUpperCase()}
                          </span>
                          <h3>{content.title}</h3>
                        </div>
                        <p className={styles.cardSlogan}>배지: {content.badge} | 통계: {content.stats}</p>
                        {content.type === 'youtube' && content.videoId && (
                          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '10px' }}>비디오 ID: {content.videoId}</p>
                        )}
                        <div className={styles.cardActions}>
                          <button className="capsule-button-outline" onClick={() => setEditingContent(content)}>수정</button>
                          <button className={`${styles.deleteBtn} capsule-button`} onClick={() => content.id && deleteContent(content.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveContent} className={`${styles.formCard} acrylic-card`}>
                  <h2>{editingContent.id ? '콘텐츠 정보 수정' : '새 콘텐츠 등록'}</h2>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>구분</label>
                      <select 
                        value={editingContent.type} 
                        onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value as 'youtube' | 'instagram' | 'blog' })}
                      >
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="blog">Blog</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>콘텐츠 제목</label>
                      <input 
                        type="text" 
                        value={editingContent.title} 
                        onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>썸네일 텍스트 또는 이미지 (카드에 표시될 문구)</label>
                      <input 
                        type="text" 
                        value={editingContent.thumbnail} 
                        onChange={(e) => setEditingContent({ ...editingContent, thumbnail: e.target.value })} 
                        placeholder="예: 🎬 STUDIO Peng1 Official Channel" 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>조회수 / 좋아요 통계 표시</label>
                      <input 
                        type="text" 
                        value={editingContent.stats} 
                        onChange={(e) => setEditingContent({ ...editingContent, stats: e.target.value })} 
                        placeholder="예: 구독자 1.2만명 • 동영상 48개 또는 좋아요 4.8천개" 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>연결 주소 (URL)</label>
                      <input 
                        type="text" 
                        value={editingContent.link} 
                        onChange={(e) => setEditingContent({ ...editingContent, link: e.target.value })} 
                        placeholder="https://www.youtube.com/@studio_peng1" 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>유튜브 비디오 ID (임베드 플레이어 재생용, YouTube만 해당)</label>
                      <input 
                        type="text" 
                        value={editingContent.videoId || ''} 
                        onChange={(e) => setEditingContent({ ...editingContent, videoId: e.target.value })} 
                        placeholder="예: dQw4w9WgXcQ (주소창 watch?v= 뒤의 11자리 값)" 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>콘텐츠 태그 배지</label>
                      <input 
                        type="text" 
                        value={editingContent.badge} 
                        onChange={(e) => setEditingContent({ ...editingContent, badge: e.target.value })} 
                        placeholder="예: Virtual Art, Design UI" 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>카드 발광 색상</label>
                      <input 
                        type="text" 
                        value={editingContent.colorGlow} 
                        onChange={(e) => setEditingContent({ ...editingContent, colorGlow: e.target.value })} 
                        placeholder="rgba(255, 213, 129, 0.15)" 
                        required 
                      />
                    </div>
                  </div>

                  {editingContent.type === 'blog' && (
                    <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
                      <div className={styles.formGroup}>
                        <label>블로그 본문 내용 (Markdown 지원)</label>
                        <textarea 
                          rows={12}
                          style={{ width: '100%', padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                          value={editingContent.blogContent || ''} 
                          onChange={(e) => setEditingContent({ ...editingContent, blogContent: e.target.value })} 
                          placeholder="마크다운 문법을 지원합니다. (예: ## 1. 소제목\n---)"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.btnGroup}>
                    <button type="submit" className="capsule-button">저장하기</button>
                    <button type="button" className="capsule-button-outline" onClick={() => setEditingContent(null)}>취소</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: Newsroom Manager */}
          {activeTab === 'newsroom' && (
            <div className={styles.tabContent}>
              {!editingNews ? (
                <div className={styles.listSection}>
                  <div className={styles.sectionHeader}>
                    <h2>📰 뉴스룸 보도자료 리스트</h2>
                    <button 
                      className="capsule-button" 
                      onClick={() => setEditingNews({ 
                        title: '', 
                        press: '', 
                        date: new Date().toISOString().split('T')[0], 
                        link: '', 
                        summary: '', 
                        content: '', 
                        colorGlow: 'rgba(255, 213, 129, 0.15)',
                        thumbnailUrl: ''
                      })}
                    >
                      + 새 보도자료 추가
                    </button>
                  </div>
                  
                  <div className={styles.listGrid}>
                    {news.map((item) => (
                      <div key={item.id} className={`${styles.listCard} acrylic-card`}>
                        <div className={styles.cardHeader}>
                          <span className={styles.pressBadge} style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: '800', 
                            padding: '3px 8px', 
                            borderRadius: '9999px',
                            background: 'rgba(var(--accent-rgb), 0.08)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(var(--accent-rgb), 0.2)'
                          }}>
                            {item.press}
                          </span>
                          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.date}</span>
                        </div>
                        <h3 style={{ margin: '8px 0', fontSize: '1.1rem', fontWeight: '800' }}>{item.title}</h3>
                        <p className={styles.cardSlogan}>{item.summary}</p>
                        <div className={styles.cardActions} style={{ marginTop: '16px' }}>
                          <button className="capsule-button-outline" onClick={() => setEditingNews(item)}>수정</button>
                          <button className={`${styles.deleteBtn} capsule-button`} onClick={() => item.id && deleteNews(item.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveNews} className={`${styles.formCard} acrylic-card`}>
                  <h2>{editingNews.id ? '보도자료 수정' : '새 보도자료 등록'}</h2>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>언론사 이름</label>
                      <input 
                        type="text" 
                        value={editingNews.press} 
                        onChange={(e) => setEditingNews({ ...editingNews, press: e.target.value })} 
                        placeholder="예: 매일경제, 전자신문" 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>보도일자</label>
                      <input 
                        type="date" 
                        value={editingNews.date} 
                        onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>보도자료 제목</label>
                      <input 
                        type="text" 
                        value={editingNews.title} 
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>기사 요약 (한 줄 요약)</label>
                      <input 
                        type="text" 
                        value={editingNews.summary} 
                        onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })} 
                        placeholder="예: BF YOONSEUL이 스마트 디바이스 어워드에서 모바일 UX 부문 우수상을 받았습니다." 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>원본 기사 링크 (URL)</label>
                      <input 
                        type="text" 
                        value={editingNews.link} 
                        onChange={(e) => setEditingNews({ ...editingNews, link: e.target.value })} 
                        placeholder="https://news.naver.com/..." 
                        required 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>카드 발광 색상</label>
                      <input 
                        type="text" 
                        value={editingNews.colorGlow || 'rgba(255, 213, 129, 0.15)'} 
                        onChange={(e) => setEditingNews({ ...editingNews, colorGlow: e.target.value })} 
                        placeholder="rgba(255, 213, 129, 0.15)" 
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>대표 이미지 (썸네일)</label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={editingNews.thumbnailUrl || ''} 
                          onChange={(e) => setEditingNews({ ...editingNews, thumbnailUrl: e.target.value })} 
                          placeholder="예: /uploads/파일명.png (또는 대표 이미지 업로드 버튼 클릭)" 
                          style={{ flex: 1 }}
                        />
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) {
                                setEditingNews({ ...editingNews, thumbnailUrl: url });
                              }
                            }
                          }}
                          style={{ display: 'none' }}
                          id="news-thumbnail-file"
                        />
                        <button 
                          type="button" 
                          className="capsule-button-outline"
                          onClick={() => document.getElementById('news-thumbnail-file')?.click()}
                          disabled={uploading}
                          style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}
                        >
                          {uploading ? '업로드 중...' : '대표 이미지 업로드'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
                    <div className={styles.formGroup}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ marginBottom: 0 }}>보도자료 본문 내용 (Markdown 지원)</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleFileUpload(file);
                                if (url) {
                                  // Append image tag to the end of content
                                  const imageTag = `\n\n![이미지 설명](${url})\n\n`;
                                  setEditingNews({ ...editingNews, content: (editingNews.content || '') + imageTag });
                                }
                              }
                            }}
                            style={{ display: 'none' }}
                            id="news-inline-image-file"
                          />
                          <button 
                            type="button" 
                            className="capsule-button-outline"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            onClick={() => document.getElementById('news-inline-image-file')?.click()}
                            disabled={uploading}
                          >
                            {uploading ? '업로드 중...' : '🖼️ 본문 이미지 삽입'}
                          </button>
                        </div>
                      </div>
                      <textarea 
                        rows={12}
                        style={{ width: '100%', padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                        value={editingNews.content} 
                        onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} 
                        placeholder="마크다운 문법을 지원합니다. (예: ## 1. 제목\n---)"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.btnGroup}>
                    <button type="submit" className="capsule-button">저장하기</button>
                    <button type="button" className="capsule-button-outline" onClick={() => setEditingNews(null)}>취소</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
