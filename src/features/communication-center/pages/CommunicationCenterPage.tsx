import {
   Mail, MessageSquare, LayoutTemplate,
  Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import  { useCallback, useEffect, useState } from 'react';
import {
  getTemplates,
  getTemplateVariables,
  type CommunicationTemplate,
} from '@/api/endpoints/communicationTemplates.api';
import { ActionTemplateCard } from '../components/ActionTemplateCard';
import { ActionTemplatePreview } from '../components/ActionTemplatePreview';
import { GlobalLayoutPanel } from '../components/GlobalLayoutPanel';

type ChannelTab = 'EMAIL' | 'SMS';
type TabId = ChannelTab | 'GLOBAL_LAYOUT';

const TABS = [
  { id: 'EMAIL' as TabId,         label: 'Email Templates', icon: Mail },
  { id: 'SMS' as TabId,           label: 'SMS Templates',   icon: MessageSquare },
  { id: 'GLOBAL_LAYOUT' as TabId, label: 'Global Layout',   icon: LayoutTemplate },
];

export default function CommunicationCenterPage() {
  const [activeTab, setActiveTab] = useState<TabId>('EMAIL');
  const [templates, setTemplates]   = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [selected, setSelected]     = useState<CommunicationTemplate | null>(null);

  /* varCache: action → string[] — populated for ALL templates on load */
  const [varCache, setVarCache] = useState<Record<string, string[]>>({});

  /* fetch all templates + their variables in parallel */
  const fetchAll = useCallback(async (channel: ChannelTab) => {
    setLoading(true); setError(null); setSelected(null); setVarCache({});
    try {
      const res = await getTemplates(channel);
      const list = res.data;
      setTemplates(list);

      /* fetch variables for every template in parallel */
      const pairs = await Promise.allSettled(
        list.map((t) => getTemplateVariables(channel, t.action)),
      );
      const cache: Record<string, string[]> = {};
      pairs.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          const action = list[idx].action;
          cache[action] = result.value.data[action] ?? [];
        }
      });
      setVarCache(cache);

      if (list.length > 0) setSelected(list[0]);
    } catch {
      setError('Failed to load templates. Please try again.');
      setTemplates([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab !== 'GLOBAL_LAYOUT') fetchAll(activeTab as ChannelTab);
  }, [activeTab, fetchAll]);

  const handleSaved = (updated: CommunicationTemplate) => {
    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelected(updated);
  };

  const isChannel = activeTab !== 'GLOBAL_LAYOUT';

  return (
    <div
      className="flex flex-col w-full px-5 py-5 md:px-7 md:py-6 gap-5 no-scrollbar"
      style={{ height: 'calc(100vh - 90px)', overflow: 'hidden' }}
    >
      {/* ── Tab bar ── */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const isGlobal = id === 'GLOBAL_LAYOUT';
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? isGlobal
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          );
        })}
      </div>

      {/* ── Global Layout ── */}
      {!isChannel && <GlobalLayoutPanel />}

      {/* ── Channel content ── */}
      {isChannel && (
        loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading templates…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-slate-600 text-sm">{error}</p>
            <button
              onClick={() => fetchAll(activeTab as ChannelTab)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        ) : (
          <div className="flex gap-5 flex-1 min-h-0">

            {/* ── Left: Card list (wider, no visible scrollbar) ── */}
            <div className="flex flex-col flex-shrink-0" style={{ width: 420 }}>
              {/* header row */}
              <div className="flex items-center justify-between mb-3 px-0.5 flex-shrink-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {templates.length} template{templates.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => fetchAll(activeTab as ChannelTab)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* scrollable card list — scrollbar hidden */}
              <div
                className="flex-1 space-y-2.5 overflow-y-auto pr-1 no-scrollbar"
              >
                {templates.map((t) => (
                  <ActionTemplateCard
                    key={t.id}
                    template={t}
                    variables={varCache[t.action] ?? []}
                    isSelected={selected?.id === t.id}
                    onSelect={(tpl) => setSelected(tpl)}
                  />
                ))}
                {templates.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    No templates found
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Preview / edit panel ── */}
            <div
              className="flex-1 min-w-0 min-h-0 flex flex-col items-center overflow-hidden"
            >
              {/* spacer — same height as card list header so preview aligns with first card */}
              {selected && <div style={{ height: 36, flexShrink: 0 }} />}
              {!selected && (
                <div className="flex items-center justify-center w-full flex-1 text-slate-400 text-sm">
                  Select a template to preview
                </div>
              )}
              {selected && (
                <div style={{ width: '100%', maxWidth: 760, flex: 1, minHeight: 0 }}>
                  <ActionTemplatePreview
                    key={`${selected.id}`}
                    template={selected}
                    variables={varCache[selected.action] ?? []}
                    onSaved={handleSaved}
                  />
                </div>
              )}
            </div>

          </div>
        )
      )}
    </div>
  );
}
