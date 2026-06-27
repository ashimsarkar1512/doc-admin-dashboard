import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Pencil, Save, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CommunicationTemplate, UpdateTemplatePayload, GlobalLayout } from '@/api/endpoints/communicationTemplates.api';
import { updateTemplate, getGlobalLayout } from '@/api/endpoints/communicationTemplates.api';

/* ── Palette (Exact match with backend email design) ── */
const HEADER_GRAD = 'linear-gradient(135deg, #2c615b 0%, #5d8e87 48%, #18312c 100%)';
const BG      = '#1b2622';
const CARD    = '#212c29';
const BORDER  = '#2e3d38';
const FOOTER  = '#1b2622';
const TEXT    = '#ffffff';
const TEXTSUB = '#c8d8d4';
const MUTED   = '#8a9b96';
const ACCENT  = '#c8d8d4';
const DASHED  = '#3a5048';
const CODEBG  = '#2a3c36';

interface ActionTemplatePreviewProps {
  template: CommunicationTemplate;
  variables: string[];
  startInEditMode?: boolean;
  onSaved: (updated: CommunicationTemplate) => void;
}



const iInput = (s?: React.CSSProperties): React.CSSProperties => ({
  background: 'transparent', border: 'none',
  borderBottom: `1.5px dashed ${DASHED}`, outline: 'none',
  color: TEXT, width: '100%', fontFamily: 'inherit', padding: '1px 0', ...s,
});

const iTextarea = (s?: React.CSSProperties): React.CSSProperties => ({
  background: 'rgba(0,0,0,0.18)', border: `1px dashed ${DASHED}`,
  borderRadius: 6, outline: 'none', color: TEXT, width: '100%',
  fontFamily: 'inherit', padding: '8px 10px', resize: 'none', lineHeight: 1.7, ...s,
});

const VariableEditor = React.forwardRef<HTMLDivElement, {
  value?: string;
  onChange: (val: string) => void;
  variables: string[];
  style?: React.CSSProperties;
  placeholder?: string;
}>((props, ref) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => divRef.current!);
  const [isFocused, setIsFocused] = useState(false);

  const formatHtml = (text: string) => {
    let html = (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/\{\{(.*?)\}\}/g, (_match, vName) => {
      const isValid = props.variables.includes(vName.trim());
      const bg = isValid ? '#2563eb' : '#ef4444';
      const shadow = isValid ? '0 1px 2px rgba(37,99,235,0.3)' : 'none';
      return `<span contenteditable="false" style="display: inline-flex; align-items: center; justify-content: center; background: ${bg}; color: white; padding: 0px 8px; height: 22px; border-radius: 6px; cursor: pointer; user-select: none; font-family: monospace; font-size: 13px; font-weight: 500; margin: 0 4px; box-shadow: ${shadow}; vertical-align: middle;">{{${vName.trim()}}}</span>`;
    });
    return html;
  };

  useEffect(() => {
    if (divRef.current) {
      const currentText = divRef.current.innerText.replace(/\n+$/, '');
      const newText = (props.value || '').replace(/\n+$/, '');
      if (currentText !== newText) {
        divRef.current.innerHTML = formatHtml(props.value || '');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.variables]);

  const handleInput = () => {
    if (divRef.current) {
      let text = divRef.current.innerText;
      text = text.replace(/\n+$/, '');
      
      // Prevent deletion of variables:
      // If the new text is missing any variable that was present in the old text, revert.
      const oldVars = (props.value || '').match(/{{(.*?)}}/g)?.map(v => v.slice(2, -2).trim()) || [];
      const usedVars = text.match(/{{(.*?)}}/g)?.map(v => v.slice(2, -2).trim()) || [];
      
      // We only care about variables that are valid template variables
      const missingVars = oldVars.filter(v => props.variables.includes(v) && !usedVars.includes(v));
      
      if (missingVars.length > 0) {
        // Revert DOM back to the last valid state
        divRef.current.innerHTML = formatHtml(props.value || '');
        
        // Optional: briefly flash the background to indicate it's locked
        divRef.current.style.transition = 'background 0.2s';
        divRef.current.style.background = 'rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
          if (divRef.current) divRef.current.style.background = 'transparent';
        }, 300);
        
        return; // Do not call onChange
      }

      props.onChange(text);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (divRef.current) {
       const text = divRef.current.innerText;
       divRef.current.innerHTML = formatHtml(text);
       props.onChange(text);
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      style={{
        ...props.style,
        outline: isFocused ? `1px solid ${ACCENT}` : 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowY: 'auto'
      }}
      data-placeholder={props.placeholder}
    />
  );
});

const parseInline = (text: string) => {
  const regex = /({{.*?}}|\*\*.*?\*\*)/g;
  return text.split(regex).map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span key={i} style={{ background: `${ACCENT}28`, color: ACCENT, border: `1px solid ${ACCENT}55`, borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace', fontSize: 13 }}>
          {part}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: TEXT }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const renderDynamicBody = (content: string) => {
  if (!content) return null;
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    const isOtpLabel = /^[A-Z][A-Z\s-]+$/.test(line) && line.length > 3;
    const nextLine = lines[i + 1]?.trim() ?? '';
    const isNextLineCode = nextLine === '{{code}}' || /^\d{4,8}$/.test(nextLine);

    if (isOtpLabel && isNextLineCode) {
      const noteLine = lines[i + 2]?.trim() ?? '';
      elements.push(
        <div key={`otp-${i}`} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', textAlign: 'center', flexShrink: 0, marginBottom: 14, marginTop: 4 }}>
          <p style={{ margin: '0 0 10px', fontSize: 9, letterSpacing: 2, color: MUTED, textTransform: 'uppercase', fontWeight: 700 }}>
            {line}
          </p>
          <div style={{ display: 'inline-block', background: CODEBG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 24px' }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 7, color: TEXT, fontFamily: "'Courier New', monospace", opacity: 0.8 }}>
              000000
            </span>
          </div>
          {noteLine && (
            <p style={{ margin: '10px 0 0', fontSize: 12, color: TEXT }}>
              {parseInline(noteLine)}
            </p>
          )}
        </div>
      );
      i += noteLine ? 3 : 2;
      continue;
    }

    elements.push(
      <p key={`text-${i}`} style={{ margin: '0 0 10px', fontSize: 15, color: TEXTSUB, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {parseInline(line)}
      </p>
    );
    i++;
  }
  return elements;
};

export const ActionTemplatePreview: React.FC<ActionTemplatePreviewProps> = ({
  template, variables, startInEditMode = false, onSaved,
}) => {
  const [mode, setMode] = useState<'preview' | 'edit'>(startInEditMode ? 'edit' : 'preview');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [layout, setLayout] = useState<GlobalLayout | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } =
    useForm<UpdateTemplatePayload>({ defaultValues: buildDefaults(template) });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(startInEditMode ? 'edit' : 'preview');
    reset(buildDefaults(template));
  }, [template.id]); // eslint-disable-line

  useEffect(() => {
    getGlobalLayout().then(res => setLayout(res.data)).catch(console.error);
  }, []);

  const onSubmit = async (data: UpdateTemplatePayload) => {
    setSaving(true);
    try {
      const res = await updateTemplate(template.id, {
        ...data,
        infoCard1Title: data.infoCard1Title || null,
        infoCard1Text:  data.infoCard1Text  || null,
        infoCard2Title: data.infoCard2Title || null,
        infoCard2Text:  data.infoCard2Text  || null,
      });
      setSaved(true);
      onSaved(res.data);
      setTimeout(() => { setSaved(false); setMode('preview'); }, 1500);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const isEdit  = mode === 'edit';

  return (
    <div
      style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 18,
        border: `1.5px solid ${BORDER}`,
        boxShadow: '0 8px 40px rgba(31,57,54,0.35), 0 2px 8px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Arial', sans-serif",
      }}
    >
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
            <Pencil size={13} /> Edit
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
              disabled={saving || !isDirty}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 16px', borderRadius: 10, border: 'none',
                background: saving || !isDirty ? `${ACCENT}70` : ACCENT,
                color: '#0f2a28', fontSize: 12, fontWeight: 700,
                cursor: saving || !isDirty ? 'not-allowed' : 'pointer',
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

      {template.channel === 'SMS' ? (
        /* ━━━━━━━━━━━━━━━━ SMS PREVIEW ━━━━━━━━━━━━━━━━ */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: BG }}>
          <div style={{ padding: '20px 24px', background: '#212c29', borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ margin: 0, fontSize: 16, color: TEXT, fontWeight: 700 }}>SMS Template</p>
          </div>
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', background: BG }}>
            {isEdit ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Controller
                  name="content"
                  control={control}
                  rules={{ 
                    required: 'SMS body is required',
                    validate: (val) => {
                      if (!val) return 'SMS body is required';
                      const usedVars = val.match(/{{(.*?)}}/g)?.map(v => v.slice(2, -2).trim()) || [];
                      const invalidVars = usedVars.filter(v => !variables.includes(v));
                      if (invalidVars.length > 0) return `Invalid variable: {{${invalidVars[0]}}}. Allowed: ${variables.map(v=>`{{${v}}}`).join(', ')}`;
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <VariableEditor
                      {...field}
                      variables={variables}
                      placeholder="SMS body…"
                      style={{ ...iTextarea({ fontSize: 14, color: TEXTSUB, padding: '14px', minHeight: 140 }), borderColor: errors.content ? '#ef4444' : DASHED }}
                    />
                  )}
                />
                {errors.content?.message && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '8px 12px', borderRadius: 6, marginTop: 10, fontSize: 12, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <AlertCircle size={14} />
                    <span>{errors.content.message}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: '#2c615b', color: '#fff', padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px', maxWidth: '85%', fontSize: 14,
                lineHeight: 1.5, alignSelf: 'flex-start',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {parseInline(template.content || '')}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
      {/* ━━━━━━━━━━━━━━━━ HEADER ━━━━━━━━━━━━━━━━ */}
      <div style={{
        background: HEADER_GRAD,
        padding: '28px 36px',
        display: 'flex', alignItems: 'center', gap: 20,
        flexShrink: 0,
      }}>
        <div style={{
          width: 180, height: 76, borderRadius: 12, flexShrink: 0,
          background: layout?.isBlack ? '#fff' : '#1b2622',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 10px', boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          {layout?.logo && (typeof layout.logo === 'string' || (layout.logo as { fileUrl?: string }).fileUrl) ? (
            <img src={typeof layout.logo === 'string' ? layout.logo : (layout.logo as { fileUrl: string }).fileUrl} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
             <span style={{ fontSize: 13, color: layout?.isBlack ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
               {layout?.brandName?.slice(0, 6) || 'LOGO'}
             </span>
          )}
        </div>
        <div style={{ flex: 1, paddingRight: 40 }}>
          {isEdit ? (
            <>
              <input
                {...register('headerTitle', { required: true })}
                style={iInput({ fontSize: 26, fontWeight: 700, display: 'block', marginBottom: 8 })}
                placeholder="Header title…"
              />
              {errors.headerTitle && (
                <p style={{ color: '#fca5a5', fontSize: 11, margin: '0 0 3px' }}>Required</p>
              )}
              <input
                {...register('headerSubtitle')}
                style={iInput({ fontSize: 15, color: TEXTSUB })}
                placeholder="Subtitle…"
              />
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>{template.headerTitle}</p>
              <p style={{ margin: '6px 0 0', fontSize: 15, color: TEXTSUB, lineHeight: 1.5 }}>{template.headerSubtitle}</p>
            </>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━ BODY ━━━━━━━━━━━━━━━━ */}
      <div 
        className="no-scrollbar"
        style={{
          background: BG, flex: 1, overflowY: 'auto',
          padding: '28px 36px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>

        <div style={{ marginBottom: 4, paddingBottom: 16, borderBottom: `1px dashed ${DASHED}` }}>
          {isEdit ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email Subject</span>
              <input
                {...register('subject', { required: true })}
                style={iInput({ fontSize: 18, fontWeight: 600, color: '#fff', paddingBottom: 4 })}
                placeholder="Email Subject line…"
              />
              {errors.subject && <span style={{ color: '#fca5a5', fontSize: 11 }}>Subject is required</span>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
               <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email Subject</span>
               <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{template.subject || '(No Subject)'}</span>
            </div>
          )}
        </div>

        {isEdit ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Controller
              name="content"
              control={control}
              rules={{ 
                required: 'Email body is required',
                validate: (val) => {
                  if (!val) return 'Email body is required';
                  const usedVars = val.match(/{{(.*?)}}/g)?.map(v => v.slice(2, -2).trim()) || [];
                  const invalidVars = usedVars.filter(v => !variables.includes(v));
                  if (invalidVars.length > 0) return `Invalid variable: {{${invalidVars[0]}}}. Allowed: ${variables.map(v=>`{{${v}}}`).join(', ')}`;
                  return true;
                }
              }}
              render={({ field }) => (
                <VariableEditor
                  {...field}
                  variables={variables}
                  placeholder={variables.length ? `Body text… e.g. {{${variables[0]}}}` : 'Email body…'}
                  style={{ ...iTextarea({ fontSize: 14, color: TEXTSUB, padding: '12px 14px', minHeight: 180 }), borderColor: errors.content ? '#ef4444' : DASHED }}
                />
              )}
            />
            {errors.content?.message && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '8px 12px', borderRadius: 6, marginTop: 10, fontSize: 12, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle size={14} />
                <span>{errors.content.message}</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {renderDynamicBody(template.content || '')}
          </div>
        )}

        {/* Info cards */}
        {(template.showInfoCards || isEdit) && (
          <>
            {isEdit && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" {...register('showInfoCards')} style={{ width: 14, height: 14, accentColor: ACCENT }} />
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Show info cards
                </span>
              </label>
            )}
            {template.showInfoCards && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { tReg: 'infoCard1Title' as const, bReg: 'infoCard1Text' as const, t: template.infoCard1Title, b: template.infoCard1Text },
                  { tReg: 'infoCard2Title' as const, bReg: 'infoCard2Text' as const, t: template.infoCard2Title, b: template.infoCard2Text },
                ].map((card, i) => (
                  <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px' }}>
                    {isEdit ? (
                      <>
                        <input {...register(card.tReg)} style={iInput({ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6b8880', marginBottom: 6 })} placeholder="CARD TITLE" />
                        <textarea {...register(card.bReg)} rows={3} style={iTextarea({ fontSize: 12, background: 'rgba(0,0,0,0.12)', border: `1px dashed ${DASHED}`, color: '#b0c4be' })} placeholder="Card text…" />
                      </>
                    ) : (
                      <>
                        <p style={{ margin: '0 0 6px', fontSize: 10, letterSpacing: 1.5, color: '#6b8880', textTransform: 'uppercase', fontWeight: 600 }}>{card.t}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#b0c4be', lineHeight: 1.5 }}>{card.b}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━ */}
      <div style={{
        background: FOOTER, borderTop: `1px solid #2a3532`,
        padding: '24px 36px', flexShrink: 0,
      }}>
        <p style={{ margin: '0 0 6px', fontSize: 15, color: '#6b8880' }}>
          <strong>{layout?.footerCompanyName || 'WeightLossMD Support'}</strong>{' • '}
          <span style={{ color: '#6b8880', fontSize: 14 }}>{layout?.footerEmail || 'support@weightlossmd.com'}</span>
        </p>
          <p style={{ margin: 0, fontSize: 13, color: '#6b8880', opacity: 0.8, lineHeight: 1.5 }}>
            {layout?.footerTagline || 'This is an automated message. Please do not reply to this email.'}
          </p>
        </div>
        </>
      )}
    </div>
  );
};

function buildDefaults(t: CommunicationTemplate): UpdateTemplatePayload {
  return {
    subject:        t.subject        ?? '',
    headerTitle:    t.headerTitle,
    headerSubtitle: t.headerSubtitle,
    content:        t.content,
    infoCard1Title: t.infoCard1Title ?? '',
    infoCard1Text:  t.infoCard1Text  ?? '',
    infoCard2Title: t.infoCard2Title ?? '',
    infoCard2Text:  t.infoCard2Text  ?? '',
    showInfoCards:  t.showInfoCards,
    isActive:       t.isActive,
  };
}