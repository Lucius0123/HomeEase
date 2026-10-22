import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '520px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{title}</h3>
            {subtitle && (
              <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginTop: 2 }}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ width: 32, height: 32 }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
