import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  MoveUp,
  MoveDown,
  Smartphone,
  Star,
  Check,
  Tag,
  Clock,
  Shield,
  HelpCircle,
  X
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Category, Service } from '../types';
import { Modal } from '../components/common/Modal';

export const CatalogView: React.FC<{ initialServiceId?: string }> = ({ initialServiceId }) => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [activeTab, setActiveTab] = useState<'categories' | 'services'>('services');

  // Category State
  const [categories, setCategories] = useState(storeState.categories);

  // Service Edit Drawer State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [drawerTab, setDrawerTab] = useState<'basic' | 'pricing' | 'inclusions' | 'addons'>('basic');
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => {
      const state = mockStore.getState();
      setStoreState(state);
      setCategories(state.categories);
    });
  }, []);

  useEffect(() => {
    if (initialServiceId) {
      const s = storeState.services.find(srv => srv.id === initialServiceId);
      if (s) {
        setEditingService({ ...s });
        setActiveTab('services');
      }
    }
  }, [initialServiceId, storeState.services]);

  const handleToggleCategoryActive = (catId: string) => {
    mockStore.toggleCategoryActive(catId);
    addToast('info', 'Category Updated', 'Toggled visibility of category in consumer catalog.');
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    setCategories(reordered);
    mockStore.reorderCategories(reordered);
    addToast('success', 'Categories Reordered', 'New home-screen order saved.');
  };

  const handleSaveService = () => {
    if (!editingService) return;
    mockStore.updateService(editingService.id, editingService);
    addToast('success', 'Service Saved', `Updated details for ${editingService.name}.`);
    setEditingService(null);
  };

  const handleTogglePublish = () => {
    if (!editingService) return;
    const newState = !editingService.published;
    setEditingService({ ...editingService, published: newState });
    mockStore.togglePublishService(editingService.id);
    setShowPublishModal(false);
    addToast(
      newState ? 'success' : 'info',
      newState ? 'Service Published' : 'Service Hidden',
      `${editingService.name} is now ${newState ? 'live for bookings' : 'hidden from catalog'}.`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Catalog Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('services')}
            className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <Layers size={16} />
            <span>Services & Packages ({storeState.services.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <Sparkles size={16} />
            <span>Marketplace Categories ({storeState.categories.length})</span>
          </button>
        </div>

        {activeTab === 'services' && (
          <button
            onClick={() => {
              const newSrv: Service = {
                id: `srv-${Date.now()}`,
                categoryId: storeState.categories[0].id,
                name: 'New Custom Home Service',
                description: 'Full description of inclusions and benefits.',
                duration: 60,
                basePrice: 799,
                memberPrice: 649,
                tiers: [{ qty: 1, price: 799 }],
                inclusions: ['Trained professional visit', 'Standard inspection & setup'],
                exclusions: ['Major parts replacement'],
                addOns: [],
                rating: 5.0,
                reviewCount: 0,
                published: true,
                imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
                cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
              };
              mockStore.addService(newSrv);
              setEditingService(newSrv);
              addToast('success', 'Service Created', 'Created a new service package draft.');
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>Add New Service Package</span>
          </button>
        )}
      </div>

      {/* Tab 1: Marketplace Categories (Drag / Move Grid with Clay Tiles) */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)' }}>
              Marketplace Category Hierarchy & Clay Tiles
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
              Order reflects the customer app home screen grid. Reorder or toggle active visibility.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20
            }}
          >
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: cat.active ? 1 : 0.65
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className="clay-card"
                        style={{
                          width: 52,
                          height: 52,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px'
                        }}
                      >
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                          Position #{idx + 1} • {cat.cities.length} Cities
                        </div>
                      </div>
                    </div>

                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleCategoryActive(cat.id)}
                      className="btn btn-sm"
                      style={{
                        height: 28,
                        fontSize: '11px',
                        background: cat.active ? 'var(--success-soft)' : 'var(--danger-soft)',
                        color: cat.active ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${cat.active ? 'rgba(18, 184, 134, 0.3)' : 'rgba(240, 82, 79, 0.3)'}`
                      }}
                    >
                      {cat.active ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 16 }}>
                    {cat.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cat.cities.map(ct => (
                      <span
                        key={ct}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'var(--surface-2)',
                          color: 'var(--ink-2)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {ct}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                    Reorder Position
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveCategory(idx, 'up')}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0 8px', height: 28 }}
                    >
                      <MoveUp size={13} />
                    </button>
                    <button
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMoveCategory(idx, 'down')}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0 8px', height: 28 }}
                    >
                      <MoveDown size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Services & Packages Table */}
      {activeTab === 'services' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Base Price</th>
                <th>Plus Member Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storeState.services.map(srv => {
                const cat = storeState.categories.find(c => c.id === srv.categoryId);
                return (
                  <tr key={srv.id} onClick={() => setEditingService({ ...srv })}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={srv.imageUrl}
                          alt={srv.name}
                          style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{srv.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-2)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {srv.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                        {cat?.name || 'Category'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                        {srv.duration} mins
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                      ₹{srv.basePrice}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }} className="tabular">
                      ₹{srv.memberPrice}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--accent)' }}>
                        ★ {srv.rating} ({srv.reviewCount})
                      </span>
                    </td>
                    <td>
                      <span
                        className={`chip ${srv.published ? 'chip-green' : 'chip-slate'}`}
                        style={{ fontSize: '11px' }}
                      >
                        <span className="chip-dot" />
                        {srv.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setEditingService({ ...srv })}
                        className="btn btn-secondary btn-sm"
                        style={{ height: 28, fontSize: '12px' }}
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Editor Drawer with Real-time Customer App Live Preview */}
      {editingService && (
        <>
          <div className="drawer-backdrop" onClick={() => setEditingService(null)} />
          <div
            className="drawer"
            style={{ width: '840px', maxWidth: '96vw' }}
          >
            {/* Drawer Header */}
            <div className="drawer-header glass">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
                  Edit Service: {editingService.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                  ID: {editingService.id} • Live Customer Mobile App Preview
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setShowPublishModal(true)}
                  className={`btn btn-sm ${editingService.published ? 'btn-outline' : 'btn-primary'}`}
                >
                  {editingService.published ? 'Unpublish' : 'Publish to App'}
                </button>
                <button
                  onClick={() => setEditingService(null)}
                  className="btn btn-ghost btn-icon btn-sm"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Body: 2-Column (Form on Left, Live Customer App Preview on Right) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                flex: 1,
                overflowY: 'auto'
              }}
            >
              {/* Left Column: Form Tabs */}
              <div style={{ padding: '24px', borderRight: '1px solid var(--border)' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  {(['basic', 'pricing', 'inclusions', 'addons'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setDrawerTab(t)}
                      className={`btn btn-sm ${drawerTab === t ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ textTransform: 'capitalize', fontSize: '12.5px' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Tab: Basic Info */}
                {drawerTab === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="form-label">Service Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingService.name}
                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={editingService.categoryId}
                        onChange={e => setEditingService({ ...editingService, categoryId: e.target.value })}
                      >
                        {storeState.categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Estimated Service Duration (Minutes)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editingService.duration}
                        onChange={e => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Customer Description</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={editingService.description}
                        onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingService.imageUrl}
                        onChange={e => setEditingService({ ...editingService, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Pricing */}
                {drawerTab === 'pricing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="form-label">Standard Customer Price (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editingService.basePrice}
                        onChange={e => setEditingService({ ...editingService, basePrice: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="form-label">HomeEase Plus Member Price (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editingService.memberPrice}
                        onChange={e => setEditingService({ ...editingService, memberPrice: Number(e.target.value) })}
                      />
                    </div>

                    <div style={{ padding: 14, borderRadius: 10, background: 'var(--primary-soft)', fontSize: '13px', color: 'var(--primary)' }}>
                      💡 Plus subscribers save ₹{editingService.basePrice - editingService.memberPrice} (
                      {Math.round(((editingService.basePrice - editingService.memberPrice) / editingService.basePrice) * 100)}% off).
                    </div>
                  </div>
                )}

                {/* Tab: Inclusions & Exclusions */}
                {drawerTab === 'inclusions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <label className="form-label">What is Included</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {editingService.inclusions.map((inc, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8 }}>
                            <input
                              type="text"
                              className="form-input"
                              value={inc}
                              onChange={e => {
                                const updated = [...editingService.inclusions];
                                updated[i] = e.target.value;
                                setEditingService({ ...editingService, inclusions: updated });
                              }}
                            />
                            <button
                              onClick={() => {
                                const updated = editingService.inclusions.filter((_, idx) => idx !== i);
                                setEditingService({ ...editingService, inclusions: updated });
                              }}
                              className="btn btn-outline btn-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setEditingService({
                              ...editingService,
                              inclusions: [...editingService.inclusions, 'New verified inclusion']
                            });
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          + Add Included Item
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">What is Excluded</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {editingService.exclusions.map((exc, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8 }}>
                            <input
                              type="text"
                              className="form-input"
                              value={exc}
                              onChange={e => {
                                const updated = [...editingService.exclusions];
                                updated[i] = e.target.value;
                                setEditingService({ ...editingService, exclusions: updated });
                              }}
                            />
                            <button
                              onClick={() => {
                                const updated = editingService.exclusions.filter((_, idx) => idx !== i);
                                setEditingService({ ...editingService, exclusions: updated });
                              }}
                              className="btn btn-outline btn-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Add-ons */}
                {drawerTab === 'addons' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" style={{ margin: 0 }}>Active Add-ons</label>
                      <button
                        onClick={() => {
                          const newAddon = {
                            id: `addon-${Date.now()}`,
                            serviceId: editingService.id,
                            name: 'Extra Detan Mask',
                            price: 199,
                            description: 'Quick add-on treatment'
                          };
                          setEditingService({
                            ...editingService,
                            addOns: [...editingService.addOns, newAddon]
                          });
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        + Add Add-on
                      </button>
                    </div>

                    {editingService.addOns.map((add, idx) => (
                      <div
                        key={add.id}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <input
                            type="text"
                            className="form-input"
                            value={add.name}
                            onChange={e => {
                              const updated = [...editingService.addOns];
                              updated[idx].name = e.target.value;
                              setEditingService({ ...editingService, addOns: updated });
                            }}
                            style={{ fontWeight: 600 }}
                          />
                          <input
                            type="number"
                            className="form-input"
                            value={add.price}
                            onChange={e => {
                              const updated = [...editingService.addOns];
                              updated[idx].price = Number(e.target.value);
                              setEditingService({ ...editingService, addOns: updated });
                            }}
                            style={{ width: 90, marginLeft: 8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Live Customer Mobile App Preview Panel */}
              <div
                style={{
                  padding: '24px',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Smartphone size={16} color="var(--primary)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase' }}>
                    Customer App Preview
                  </span>
                </div>

                {/* Simulated Phone Frame */}
                <div
                  style={{
                    width: '280px',
                    borderRadius: '28px',
                    background: '#FFFFFF',
                    border: '8px solid #1E1D3D',
                    boxShadow: 'var(--shadow-e3)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Phone Notch */}
                  <div style={{ height: 18, background: '#1E1D3D', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 4, borderRadius: 2, background: '#454271' }} />
                  </div>

                  {/* Service Card Image */}
                  <div style={{ position: 'relative', height: 140 }}>
                    <img
                      src={editingService.imageUrl}
                      alt={editingService.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        padding: '2px 6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      ★ {editingService.rating}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#11122B', lineHeight: 1.3 }}>
                        {editingService.name}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '11px', color: '#5B5F7A' }}>
                        <Clock size={12} />
                        <span>{editingService.duration} mins</span>
                      </div>

                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#11122B' }}>
                          ₹{editingService.basePrice}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6C4DFF', fontWeight: 700 }}>
                          Plus: ₹{editingService.memberPrice}
                        </span>
                      </div>

                      {/* Inclusions preview */}
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {editingService.inclusions.slice(0, 2).map((inc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10.5px', color: '#495057' }}>
                            <Check size={11} color="#12B886" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      style={{
                        marginTop: 14,
                        width: '100%',
                        height: 32,
                        borderRadius: 8,
                        background: '#6C4DFF',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="drawer-footer">
              <button onClick={() => setEditingService(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleSaveService} className="btn btn-primary btn-sm">
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* Publish Toggle Confirmation Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title={editingService?.published ? 'Unpublish Service Package?' : 'Publish Service to Live Mobile App?'}
        subtitle={
          editingService?.published
            ? 'Customers will no longer be able to discover or book this service.'
            : 'This service will immediately appear in the mobile app catalog.'
        }
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowPublishModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleTogglePublish}>
              Confirm
            </button>
          </>
        }
      >
        <p style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
          Target: <strong>{editingService?.name}</strong> (Base: ₹{editingService?.basePrice}).
        </p>
      </Modal>
    </div>
  );
};
