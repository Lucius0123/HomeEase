import React, { useState, useEffect } from 'react';
import {
  SmartphoneNfc,
  Plus,
  MoveUp,
  MoveDown,
  Sparkles,
  Image,
  Eye,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Zap,
  Trash2
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Banner, CMSSection } from '../types';
import { Modal } from '../components/common/Modal';

export const AppContentCMSView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [banners, setBanners] = useState(storeState.banners);
  const [sections, setSections] = useState(storeState.cmsSections);

  // New Banner Modal
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80');
  const [newLink, setNewLink] = useState('homease://category/cat-salon-women');

  useEffect(() => {
    return mockStore.subscribe(() => {
      const state = mockStore.getState();
      setStoreState(state);
      setBanners(state.banners);
      setSections(state.cmsSections);
    });
  }, []);

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    const updated = reordered.map((sec, i) => ({ ...sec, order: i + 1 }));
    setSections(updated);
    mockStore.reorderCMSSections(updated);
    addToast('success', 'Home Screen Updated', 'Reordered customer home screen sections.');
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const banner: Banner = {
      id: `ban-${Date.now()}`,
      image: newImage,
      title: newTitle,
      subtitle: newSubtitle,
      deepLink: newLink,
      order: banners.length + 1,
      startsAt: '2026-10-22',
      endsAt: '2026-11-30',
      active: true
    };

    mockStore.addBanner(banner);
    setShowAddBannerModal(false);
    setNewTitle('');
    setNewSubtitle('');
    addToast('success', 'Hero Banner Published', 'New banner live on mobile app home screen.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner Explaining Demo Moment */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1C1948, #0E0D24)',
          border: '1px solid rgba(139, 115, 255, 0.25)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="clay-badge" style={{ width: 40, height: 40, borderRadius: 12 }}>
            <SmartphoneNfc size={22} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
              App Content CMS & Dynamic Home Layout
            </h2>
            <p style={{ fontSize: '13px', color: '#B5B8DA' }}>
              Changes made here update the Customer App instantly without app store release cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Controls on Left, Interactive Phone Frame on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 24,
          alignItems: 'start'
        }}
      >
        {/* Left Side: CMS Editors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Hero Banner Carousel Editor */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                  Hero Promotional Carousel
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                  Top scrollable campaign banners
                </p>
              </div>
              <button
                onClick={() => setShowAddBannerModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Add Banner</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {banners.map((ban, idx) => (
                <div
                  key={ban.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 12,
                    borderRadius: 12,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <img
                    src={ban.image}
                    alt={ban.title}
                    style={{ width: 80, height: 50, borderRadius: 8, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                      {ban.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ban.subtitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: 2 }}>
                      Link: {ban.deepLink}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home Screen Section Order Manager */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
              Home Screen Section Ordering
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 16 }}>
              Move widgets up or down to re-prioritize user engagement
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'var(--primary-soft)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                        {sec.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                        Widget Type: {sec.type}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="btn btn-outline btn-sm"
                      style={{ height: 28, padding: '0 8px' }}
                    >
                      <MoveUp size={13} />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="btn btn-outline btn-sm"
                      style={{ height: 28, padding: '0 8px' }}
                    >
                      <MoveDown size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mobile App Mockup Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'sticky',
            top: 96
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 12 }}>
            Interactive Live App Mirror
          </div>

          <div
            style={{
              width: '320px',
              height: '660px',
              borderRadius: '36px',
              background: '#FFFFFF',
              border: '10px solid #16152E',
              boxShadow: '0 24px 60px rgba(17, 18, 43, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Notch */}
            <div style={{ height: 22, background: '#16152E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 56, height: 5, borderRadius: 3, background: '#444268' }} />
            </div>

            {/* Simulated App Header */}
            <div style={{ padding: '12px 16px', background: '#FFFFFF', borderBottom: '1px solid #EEF0F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#8B8FA8', fontWeight: 600 }}>DELIVERING TO</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#11122B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Safdarjung Enclave, Delhi</span>
                  <span style={{ color: '#6C4DFF' }}>▼</span>
                </div>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFEBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C4DFF', fontSize: '12px', fontWeight: 700 }}>
                AK
              </div>
            </div>

            {/* Scrollable Simulated App Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#F8F9FD', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sections.map(sec => {
                if (sec.type === 'banner') {
                  const heroBanner = banners[0];
                  return (
                    <div
                      key={sec.id}
                      style={{
                        position: 'relative',
                        borderRadius: 14,
                        overflow: 'hidden',
                        height: 120,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}
                    >
                      <img
                        src={heroBanner?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'}
                        alt="banner"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 80%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: 10,
                          color: '#FFFFFF'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>{heroBanner?.title}</div>
                        <div style={{ fontSize: '10px', color: '#EFEBFF' }}>{heroBanner?.subtitle}</div>
                      </div>
                    </div>
                  );
                }

                if (sec.type === 'categories') {
                  return (
                    <div key={sec.id}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#11122B', marginBottom: 8 }}>
                        Top Services
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {storeState.categories.slice(0, 6).map(c => (
                          <div
                            key={c.id}
                            style={{
                              background: '#FFFFFF',
                              padding: '8px 6px',
                              borderRadius: 10,
                              textAlign: 'center',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                            }}
                          >
                            <div style={{ fontSize: '16px', marginBottom: 2 }}>✨</div>
                            <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#11122B', lineHeight: 1.2 }}>
                              {c.name.split(' ')[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.type === 'promo') {
                  return (
                    <div
                      key={sec.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #FFB547, #F59F00)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800 }}>HomeEase Plus VIP</div>
                        <div style={{ fontSize: '9px', opacity: 0.9 }}>Flat 20% off all bookings</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, background: '#FFFFFF', color: '#B45309', padding: '3px 8px', borderRadius: 6 }}>
                        Upgrade
                      </span>
                    </div>
                  );
                }

                if (sec.type === 'popular') {
                  return (
                    <div key={sec.id}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#11122B', marginBottom: 8 }}>
                        Most Booked This Week
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {storeState.services.slice(0, 2).map(s => (
                          <div
                            key={s.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: 6,
                              borderRadius: 8,
                              background: '#FFFFFF'
                            }}
                          >
                            <img src={s.imageUrl} alt="" style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#11122B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {s.name}
                              </div>
                              <div style={{ fontSize: '10px', color: '#6C4DFF', fontWeight: 700 }}>
                                ₹{s.basePrice}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Banner Modal */}
      <Modal
        isOpen={showAddBannerModal}
        onClose={() => setShowAddBannerModal(false)}
        title="Add Hero Campaign Banner"
        subtitle="Publish a new promotional carousel slide"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAddBannerModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateBanner}>
              Add & Publish
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateBanner} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Banner Headline</label>
            <input
              type="text"
              className="form-input"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
              placeholder="e.g. Winter Deep Cleaning Offer"
            />
          </div>
          <div>
            <label className="form-label">Subtitle / Subtext</label>
            <input
              type="text"
              className="form-input"
              value={newSubtitle}
              onChange={e => setNewSubtitle(e.target.value)}
              placeholder="e.g. Up to 30% off across Delhi NCR"
            />
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-input"
              value={newImage}
              onChange={e => setNewImage(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
