import React, { useState } from 'react';
import { ChatSession, TriageLevel, UserProfile } from '../types';
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldAlert,
  FileText,
  Camera,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Sliders,
  User,
  AlertCircle,
  Download,
} from 'lucide-react';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onClearAllSessions: () => void;
  currentProfile: UserProfile;
  onOpenProfileModal: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  currentProfile,
  onOpenProfileModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [triageFilter, setTriageFilter] = useState<'all' | 'emergency' | 'urgent' | 'routine'>('all');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const startRenaming = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleValue(session.title);
  };

  const handleSaveRename = (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitleValue.trim()) {
      onRenameSession(sessionId, editTitleValue.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (triageFilter === 'emergency') {
      return (
        s.triageLevel?.includes('Level 4') ||
        s.messages.some((m) => m.triageLevel?.includes('Level 4') || m.isEmergencyOverride)
      );
    }
    if (triageFilter === 'urgent') {
      return (
        s.triageLevel?.includes('Level 3') ||
        s.messages.some((m) => m.triageLevel?.includes('Level 3'))
      );
    }
    if (triageFilter === 'routine') {
      return (
        s.triageLevel?.includes('Level 1') ||
        s.triageLevel?.includes('Level 2') ||
        (!s.triageLevel && !s.messages.some((m) => m.triageLevel?.includes('Level 4')))
      );
    }
    return true;
  });

  // Group sessions by date
  const groupSessions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const last7Days = today - 86400000 * 7;

    const groups: {
      today: ChatSession[];
      yesterday: ChatSession[];
      last7Days: ChatSession[];
      older: ChatSession[];
    } = {
      today: [],
      yesterday: [],
      last7Days: [],
      older: [],
    };

    filteredSessions.forEach((s) => {
      const time = new Date(s.updatedAt || s.createdAt).getTime();
      if (time >= today) {
        groups.today.push(s);
      } else if (time >= yesterday) {
        groups.yesterday.push(s);
      } else if (time >= last7Days) {
        groups.last7Days.push(s);
      } else {
        groups.older.push(s);
      }
    });

    return groups;
  };

  const grouped = groupSessions();

  const getTriageBadge = (session: ChatSession) => {
    const isEmerg =
      session.triageLevel?.includes('Level 4') ||
      session.messages.some((m) => m.triageLevel?.includes('Level 4') || m.isEmergencyOverride);
    const isUrgent =
      session.triageLevel?.includes('Level 3') ||
      session.messages.some((m) => m.triageLevel?.includes('Level 3'));

    if (isEmerg) {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
          <ShieldAlert className="w-2.5 h-2.5" /> Emergency
        </span>
      );
    }
    if (isUrgent) {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          Urgent 24h
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
        Routine
      </span>
    );
  };

  const renderSessionCard = (session: ChatSession) => {
    const isActive = session.id === activeSessionId;
    const isEditing = editingSessionId === session.id;
    const hasImage = session.messages.some((m) => m.attachments?.some((a) => a.type === 'image'));
    const hasDoc = session.messages.some((m) => m.attachments?.some((a) => a.type === 'document'));

    return (
      <div
        key={session.id}
        id={`session-item-${session.id}`}
        onClick={() => {
          if (!isEditing) {
            onSelectSession(session.id);
          }
        }}
        className={`group relative rounded-xl p-2.5 mb-1.5 transition-all cursor-pointer border ${
          isActive
            ? 'bg-teal-50/95 dark:bg-teal-950/70 border-teal-400 dark:border-teal-600 shadow-xs ring-1 ring-teal-500/30'
            : 'bg-white/80 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {isEditing ? (
          <form onSubmit={(e) => handleSaveRename(session.id, e)} className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              className="flex-1 text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-800 border border-teal-500 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950 rounded"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancelRename}
              className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 animate-pulse" />
                )}
                <h4
                  className={`text-xs font-bold truncate ${
                    isActive
                      ? 'text-teal-950 dark:text-teal-100 font-semibold'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                  title={session.title}
                >
                  {session.title}
                </h4>
              </div>

              {/* Action Buttons (Visible on hover or active) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => startRenaming(session, e)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700"
                  title="Rename title"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-100/60 dark:hover:bg-rose-950"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Metadata Preview */}
            <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(session.updatedAt || session.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>&bull;</span>
                <span>{session.messages.length} msgs</span>
                {hasImage && (
                  <span title="Has image pre-screening" className="inline-flex items-center">
                    <Camera className="w-2.5 h-2.5 text-indigo-500" />
                  </span>
                )}
                {hasDoc && (
                  <span title="Has lab document report" className="inline-flex items-center">
                    <FileText className="w-2.5 h-2.5 text-amber-500" />
                  </span>
                )}
              </div>

              {getTriageBadge(session)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="medtrack-chat-history-sidebar"
        className={`fixed lg:sticky top-0 lg:top-[57px] bottom-0 left-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out shadow-lg lg:shadow-none h-screen lg:h-[calc(100vh-57px)] shrink-0 ${
          isOpen ? 'w-80 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-r-0'
        }`}
      >
        {isOpen && (
          <div className="flex flex-col h-full w-80 min-w-[320px]">
            {/* Top Sidebar Header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-outfit">
                    Chat History
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {sessions.length} Saved Consultations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggle}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Close History Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary Action: New Consultation Button */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
              <button
                id="sidebar-new-consultation-btn"
                type="button"
                onClick={() => {
                  onNewSession();
                  if (window.innerWidth < 1024) onToggle();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                <span>New Consultation</span>
              </button>

              {/* Search input */}
              <div className="relative mt-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search symptoms, tags & history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Triage Filter Chips */}
              <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 scrollbar-none">
                {(['all', 'emergency', 'urgent', 'routine'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setTriageFilter(filterKey)}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                      triageFilter === filterKey
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Session List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredSessions.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No consultations found
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {searchQuery ? 'Try clearing your search query.' : 'Start your first consultation.'}
                  </p>
                </div>
              ) : (
                <>
                  {grouped.today.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-1">
                        Today
                      </div>
                      {grouped.today.map(renderSessionCard)}
                    </div>
                  )}

                  {grouped.yesterday.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-1">
                        Yesterday
                      </div>
                      {grouped.yesterday.map(renderSessionCard)}
                    </div>
                  )}

                  {grouped.last7Days.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-1">
                        Previous 7 Days
                      </div>
                      {grouped.last7Days.map(renderSessionCard)}
                    </div>
                  )}

                  {grouped.older.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-1">
                        Older
                      </div>
                      {grouped.older.map(renderSessionCard)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar Bottom Footer: Active Profile & Clear Actions */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-2">
              {/* Active Profile Info */}
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {currentProfile.avatarUrl ? (
                    <img
                      src={currentProfile.avatarUrl}
                      alt={currentProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentProfile.name ? currentProfile.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentProfile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {currentProfile.demographics.age}y &bull; BMI {currentProfile.metrics.bmi}
                    </p>
                  </div>
                </div>
                <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0" />
              </button>

              {/* Clear History Trigger */}
              {confirmClearOpen ? (
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-center">
                  <p className="text-[11px] font-bold text-rose-900 dark:text-rose-200">
                    Clear all history?
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllSessions();
                        setConfirmClearOpen(false);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearOpen(false)}
                      className="px-2.5 py-1 text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 dark:text-slate-400">
                  <span>PulseHealth DB Sync</span>
                  <button
                    type="button"
                    onClick={() => setConfirmClearOpen(true)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
