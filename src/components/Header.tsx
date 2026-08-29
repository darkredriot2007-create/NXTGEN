import React from 'react';
import { UserProfile, AuthUser, NotificationSettings } from '../types';
import { MedtrackLogo } from './MedtrackLogo';
import { FeaturesHubDropdown } from './FeaturesHubDropdown';
import {
  PanelLeft,
  Plus,
  Search,
} from 'lucide-react';

interface HeaderProps {
  currentProfile: UserProfile;
  currentUser: AuthUser | null;
  notificationSettings: NotificationSettings;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenReminderSettings: () => void;
  onTriggerEmergencyBanner: () => void;
  onOpenClinicalBrief: () => void;
  onResetConsultation: () => void;
  onOpenSampleScenarios: () => void;
  onOpenTesterHub: () => void;
  onOpenOpeningScreen?: () => void;
  onOpenPharmacyLocator: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onNewSession?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  currentUser,
  notificationSettings,
  darkMode,
  onToggleDarkMode,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenReminderSettings,
  onTriggerEmergencyBanner,
  onOpenClinicalBrief,
  onResetConsultation,
  onOpenSampleScenarios,
  onOpenTesterHub,
  onOpenOpeningScreen,
  onOpenPharmacyLocator,
  isSidebarOpen = true,
  onToggleSidebar,
  onNewSession,
}) => {
  return (
    <header
      id="medtrack-main-header"
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-teal-100 dark:border-slate-800 sticky top-0 z-20 shadow-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Sidebar Toggle & Medtrack AI & PulseHealth AI Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onToggleSidebar && (
              <button
                id="header-toggle-sidebar-btn"
                type="button"
                onClick={onToggleSidebar}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSidebarOpen
                    ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-700'
                }`}
                title={isSidebarOpen ? 'Hide Chat History Dashboard' : 'Open Chat History Dashboard'}
                aria-label="Toggle history dashboard"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <button
              id="header-brand-logo-btn"
              type="button"
              onClick={onOpenOpeningScreen}
              className="group flex items-center gap-2.5 text-left rounded-2xl p-1 -m-1 hover:bg-teal-50/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer min-w-0"
              title="Click to view MedTrack AI & PulseHealth AI Overview & Features"
            >
              <MedtrackLogo size={32} animated={true} />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-outfit group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    MedTrack <span className="text-teal-600 dark:text-teal-400">AI</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 hidden xs:inline-block">
                    PulseHealth AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 truncate hidden sm:block">
                  Track &bull; Aware &bull; Stay Healthy
                </span>
              </div>
            </button>

            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full">
                Clinical Triage
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/70 px-2 py-0.5 rounded-full">
                <Search className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                RAG Grounded
              </span>
            </div>
          </div>

          {/* Right: Consolidated Single Features Button (+ Optional Quick New Chat) */}
          <div className="flex items-center gap-2 shrink-0">
            {onNewSession && (
              <button
                type="button"
                id="header-quick-new-chat-btn"
                onClick={onNewSession}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-900 dark:text-teal-200 text-xs font-bold rounded-xl border border-teal-200/80 dark:border-teal-800/80 transition-colors shadow-2xs cursor-pointer"
                title="Start a new consultation"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>New Chat</span>
              </button>
            )}

            {/* Single Unified Features & Tools Hub Button */}
            <FeaturesHubDropdown
              currentProfile={currentProfile}
              currentUser={currentUser}
              notificationSettings={notificationSettings}
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
              onOpenAuthModal={onOpenAuthModal}
              onOpenProfileModal={onOpenProfileModal}
              onOpenReminderSettings={onOpenReminderSettings}
              onTriggerEmergencyBanner={onTriggerEmergencyBanner}
              onOpenClinicalBrief={onOpenClinicalBrief}
              onResetConsultation={onResetConsultation}
              onOpenSampleScenarios={onOpenSampleScenarios}
              onOpenTesterHub={onOpenTesterHub}
              onOpenOpeningScreen={onOpenOpeningScreen}
              onOpenPharmacyLocator={onOpenPharmacyLocator}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
