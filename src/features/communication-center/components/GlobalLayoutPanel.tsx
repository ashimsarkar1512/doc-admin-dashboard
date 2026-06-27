import React, { useEffect, useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Save, RefreshCw, CheckCircle2, AlertCircle, Loader2, Upload, Pencil, X
} from 'lucide-react';
import {
  getGlobalLayout, updateGlobalLayout,
  type UpdateGlobalLayoutPayload,
} from '@/api/endpoints/communicationTemplates.api';
import { uploadAttachment } from '@/api/endpoints/attachments.api';

type FormValues = UpdateGlobalLayoutPayload;

/* ── Palette (Exact match with backend email design) ── */
const HEADER_GRAD = 'linear-gradient(135deg, #2c615b 0%, #5d8e87 48%, #18312c 100%)';
const BG      = '#1b2622';
const BORDER  = '#2e3d38';
const FOOTER  = '#1b2622';
const TEXT    = '#ffffff';
const TEXTSUB = '#c8d8d4';
const MUTED   = '#8a9b96';
const DASHED  = '#3a5048';
const ACCENT  = '#c8d8d4';

const iInput = (s?: React.CSSProperties): React.CSSProperties => ({
  background: 'transparent', border: 'none',
  borderBottom: `1.5px dashed ${DASHED}`, outline: 'none',
  color: TEXT, width: '100%', fontFamily: 'inherit', padding: '1px 0', ...s,
});

export const GlobalLayoutPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { isDirty } } = useForm<FormValues>();
  const watchedValues = useWatch({ control }) as FormValues;

  const fetchLayout = async () => {
    setLoading(true); setFetchError(null);
    try {
      const res = await getGlobalLayout();
      if (res.data.logo) {
        setLogoPreviewUrl(typeof res.data.logo === 'string' ? res.data.logo : (res.data.logo as { fileUrl: string }).fileUrl);
      }
      reset({ brandName: res.data.brandName, headerTitle: res.data.headerTitle, headerSubtitle: res.data.headerSubtitle, footerCompanyName: res.data.footerCompanyName, footerEmail: res.data.footerEmail, footerTagline: res.data.footerTagline, isBlack: res.data.isBlack, isActive: res.data.isActive, logoId: res.data.logoId });
    } catch { setFetchError('Failed to load global layout. Please try again.'); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchLayout(); }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const response = await uploadAttachment(file, 'WEBSITE_LOGO');
      setLogoPreviewUrl(response.fileUrl);
      setValue('logoId', response.id, { shouldDirty: true });
    } catch (err) {
      console.error('Failed to upload logo', err);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      await updateGlobalLayout(data);
      reset(data);
      setSaved(true);
      setTimeout(() => { setSaved(false); setMode('preview'); }, 1500);
    } catch { 
      alert('Failed to save layout.');
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-500">Loading global layout…</p>
      </div>
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="text-slate-600 text-sm">{fetchError}</p>
      <button onClick={fetchLayout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
        <RefreshCw className="h-4 w-4" /> Retry
      </button>
    </div>
  );

  const isEdit = mode === 'edit';

  return (
    <div className="flex justify-center h-full overflow-hidden w-full">
      <div className="w-full max-w-[760px] h-full flex flex-col relative rounded-2xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 40px rgba(31,57,54,0.35), 0 2px 8px rgba(0,0,0,0.18)', fontFamily: "'Arial', sans-serif" }}>
        
        {/* ── Floating action buttons ── */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', alignItems: 'center', gap: 6, zIndex: 10,
        }}>
          {saved && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 8,
              background: 'rgba(127,196,189,0.25)',
              backdropFilter: 'blur(8px)',
              color: ACCENT, fontSize: 11, fontWeight: 700,
              border: `1px solid ${ACCENT}66`,
            }}>
              <CheckCircle2 size={12} /> Saved
            </span>
          )}

          {!isEdit ? (
            <button
              type="button"
              onClick={() => setMode('edit')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 18px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.22)',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#ffffff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: 0.3,
              }}
            >
              <Pencil size={13} /> Edit Layout
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { reset(); setMode('preview'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 9,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <X size={12} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={saving || (!isDirty && !logoPreviewUrl)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 16px', borderRadius: 10, border: 'none',
                  background: saving || (!isDirty && !logoPreviewUrl) ? `${ACCENT}70` : ACCENT,
                  color: '#0f2a28', fontSize: 12, fontWeight: 700,
                  cursor: saving || (!isDirty && !logoPreviewUrl) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {saving
                  ? <><Loader2 size={12} className="animate-spin" /> Saving…</>
                  : <><Save size={12} /> Save</>}
              </button>
            </>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━ HEADER ━━━━━━━━━━━━━━━━ */}
        <div style={{
          background: HEADER_GRAD,
          padding: '28px 36px',
          display: 'flex', alignItems: 'center', gap: 24,
          flexShrink: 0,
        }}>
          <div style={{
            width: 180, height: 76, borderRadius: 12, flexShrink: 0,
            background: watchedValues.isBlack ? '#fff' : '#1b2622',
            border: `1px solid ${watchedValues.isBlack ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 10px', boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
            cursor: isEdit ? 'pointer' : 'default',
          }}
          onClick={() => isEdit && fileInputRef.current?.click()}
          >
            {logoPreviewUrl ? (
               <img src={logoPreviewUrl} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 13, color: watchedValues.isBlack ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                {watchedValues.brandName?.slice(0, 6) || 'LOGO'}
              </span>
            )}
            
            {isEdit && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: uploadingLogo ? 1 : 0, transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = uploadingLogo ? '1' : '0'}
              >
                {uploadingLogo ? <Loader2 size={20} color="#fff" className="animate-spin" /> : <Upload size={20} color="#fff" />}
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
          </div>

          <div style={{ flex: 1, paddingRight: 40 }}>
            {isEdit ? (
              <>
                <input
                  {...register('headerTitle', { required: true })}
                  style={iInput({ fontSize: 26, fontWeight: 700, display: 'block', marginBottom: 8 })}
                  placeholder="Header title…"
                />
                <input
                  {...register('headerSubtitle')}
                  style={iInput({ fontSize: 15, color: TEXTSUB })}
                  placeholder="Subtitle…"
                />
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>
                  {watchedValues.headerTitle || 'System Notification'}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 15, color: TEXTSUB, lineHeight: 1.5 }}>
                  {watchedValues.headerSubtitle || 'We have an important update regarding your account.'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━ BODY ━━━━━━━━━━━━━━━━ */}
        <div 
          className="no-scrollbar"
          style={{
            background: BG, overflowY: 'auto', flex: 1,
            padding: '28px 36px',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
          <div style={{
            flex: 1, border: `2px dashed ${DASHED}`, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 120, background: 'rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: 13, color: MUTED, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
              Action Template Body Goes Here
            </span>
          </div>
          
          {isEdit && (
             <div style={{ marginTop: 'auto', paddingTop: 28, borderTop: `1px dashed ${DASHED}` }}>
               <p style={{ fontSize: 13, color: MUTED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Brand Identity</p>
               <input
                  {...register('brandName', { required: true })}
                  style={iInput({ fontSize: 15, color: TEXTSUB, marginBottom: 12 })}
                  placeholder="Brand Name (e.g. WEIGHTLOSSMD)"
               />
               <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" {...register('isBlack')} style={{ width: 18, height: 18, accentColor: ACCENT }} />
                  <span style={{ fontSize: 14, color: TEXTSUB }}>Dark Teal Theme (Active)</span>
               </label>
             </div>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━ */}
        <div style={{
          background: FOOTER, borderTop: `1px solid #2a3532`,
          padding: '24px 36px', flexShrink: 0,
        }}>
          {isEdit ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <input
                  {...register('footerCompanyName')}
                  style={iInput({ fontSize: 15, fontWeight: 700, color: '#6b8880', width: 'auto', minWidth: 200 })}
                  placeholder="Company Name…"
                />
                <span style={{ color: '#6b8880', fontSize: 15 }}>•</span>
                <input
                  {...register('footerEmail')}
                  style={iInput({ fontSize: 14, color: '#6b8880', flex: 1 })}
                  placeholder="Support Email…"
                />
              </div>
              <input
                {...register('footerTagline')}
                style={iInput({ fontSize: 13, color: '#6b8880', opacity: 0.8 })}
                placeholder="Footer Tagline…"
              />
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 6px', fontSize: 15, color: '#6b8880' }}>
                <strong>{watchedValues.footerCompanyName || 'WeightLossMD Support'}</strong>{' • '}
                <span style={{ color: '#6b8880', fontSize: 14 }}>{watchedValues.footerEmail || 'support@weightlossmd.com'}</span>
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#6b8880', opacity: 0.8, lineHeight: 1.5 }}>
                {watchedValues.footerTagline || 'This is an automated message. Please do not reply to this email.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
