import React, { useState, useEffect } from 'react';
import { UserProfile, AuthUser, NotificationSettings } from '../types';
import { MedtrackLogo } from './MedtrackLogo';
import {
  User,
  ShieldAlert,
  Printer,
  RotateCcw,
  Sparkles,
  Search,
  FileBadge,
  Sliders,
  LogIn,
  Facebook,
  Mail,
  Bell,
  BellOff,
  Sun,
  Moon,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { getBrowserNotificationPermission } from '../utils/notifications';

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
}) => {
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() =>
    getBrowserNotificationPermission()
  );
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setBrowserPermission(getBrowserNotificationPermission());
    };
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);
    const interval = setInterval(handleSync, 3000);
    return () => {
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
      clearInterval(interval);
    };
  }, []);

  const isBlocked = notificationSettings.enabled && browserPermission === 'denied';

  return (
    <header
      id="medtrack-main-header"
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-teal-100 dark:border-slate-800 sticky top-0 z-20 shadow-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Medtrack AI & PulseHealth AI Brand & Mission Statement */}
          <div className="flex items-center gap-3">
            <button
              id="header-brand-logo-btn"
              type="button"
              onClick={onOpenOpeningScreen}
              className="group flex items-center gap-2.5 text-left rounded-2xl p-1 -m-1 hover:bg-teal-50/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              title="Click to view MedTrack AI & PulseHealth AI Overview & Features"
            >
              <MedtrackLogo size={36} animated={true} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-outfit group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    MedTrack <span className="text-teal-600 dark:text-teal-400">AI</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    PulseHealth AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                  Track &bull; Aware &bull; Stay Healthy
                </span>
              </div>
            </button>
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full">
                Clinical Health &amp; Triage
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/70 px-2 py-0.5 rounded-full">
                <Search className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                RAG Grounded
              </span>
            </div>
          </div>

          {/* Quick Actions & Active Profile Pill */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Daily Reminder & Notification System */}
            <button
              id="header-reminders-btn"
              onClick={onOpenReminderSettings}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                isBlocked
                  ? 'bg-rose-50 dark:bg-rose-950/70 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700/80 animate-pulse'
                  : notificationSettings.enabled
                  ? 'bg-teal-50/90 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700/80'
                  : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={
                isBlocked
                  ? '⚠️ Notifications blocked in browser settings. Click to view unblock guide.'
                  : `Daily Reminders: ${notificationSettings.enabled ? `Active at ${notificationSettings.time}` : 'Off (Click to configure)'}`
              }
            >
              <div className="relative">
                {isBlocked ? (
                  <BellOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                ) : (
                  <Bell className={`w-3.5 h-3.5 ${notificationSettings.enabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                )}
                {notificationSettings.enabled && !isBlocked && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                )}
                {notificationSettings.enabled && !isBlocked && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                )}
                {isBlocked && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </div>
              <span className="hidden sm:inline">
                {isBlocked ? 'Blocked in Browser' : 'Daily Reminder'}
              </span>
              <span className="sm:hidden">{isBlocked ? 'Blocked' : 'Reminder'}</span>
              {notificationSettings.enabled && !isBlocked && (
                <span className="text-[10px] font-mono font-bold bg-teal-100/80 dark:bg-teal-900/80 text-teal-800 dark:text-teal-200 px-1 rounded">
                  {notificationSettings.time}
                </span>
              )}
              {isBlocked && (
                <span className="text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 px-1.5 rounded-full">
                  Unblock
                </span>
              )}
            </button>

            {/* Google Maps Pharmacy & Medical Store Locator */}
            <button
              id="header-pharmacy-locator-btn"
              onClick={onOpenPharmacyLocator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs rounded-xl transition-all border border-emerald-300 dark:border-emerald-700 shadow-2xs cursor-pointer"
              title="Find nearest medical stores & pharmacies for required medicines via Google Maps & GPS"
            >
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">📍</span>
              <span className="hidden sm:inline">Nearby Pharmacies</span>
              <span className="sm:hidden">Pharmacies</span>
              <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-extrabold px-1.5 py-0.2 rounded-md">
                GPS
              </span>
            </button>

            {/* Multi-User & QA Testing Hub Trigger */}
            <button
              id="header-tester-hub-btn"
              onClick={onOpenTesterHub}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50/90 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-900 dark:text-purple-200 font-bold text-xs rounded-xl transition-all border border-purple-200/80 dark:border-purple-800/80 shadow-2xs cursor-pointer"
              title="Multi-User Testing, Personas & Audio Alarm Simulator"
            >
              <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Testing Hub</span>
            </button>

            {/* Sample Scenarios Demo Trigger */}
            <button
              id="header-samples-btn"
              onClick={onOpenSampleScenarios}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 font-semibold text-xs rounded-xl transition-colors border border-indigo-200/70 dark:border-indigo-800/70 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Scenarios</span>
            </button>

            {/* Print Doctor Clinical Brief */}
            <button
              id="header-clinical-brief-btn"
              onClick={onOpenClinicalBrief}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-900 dark:text-teal-200 font-semibold text-xs rounded-xl transition-colors border border-teal-200/70 dark:border-teal-800/70 shadow-2xs cursor-pointer"
              title="Generate printable summary for doctor visit"
            >
              <FileBadge className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Doctor Brief</span>
            </button>

            {/* Red Flag Emergency Test button */}
            <button
              id="header-emergency-trigger-btn"
              onClick={onTriggerEmergencyBanner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50/90 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-bold text-xs rounded-xl transition-colors border border-rose-200/80 dark:border-rose-800/80 shadow-2xs cursor-pointer"
              title="View Level 4 Emergency Red Flag Checklist"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>🚨 Red Flags</span>
            </button>

            {/* Active User Context Pill */}
            <button
              id="header-profile-pill-btn"
              onClick={onOpenProfileModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/70 rounded-xl text-xs font-semibold transition-all group shadow-2xs cursor-pointer"
            >
              {currentProfile.avatarUrl ? (
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-emerald-600 dark:border-emerald-400 shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentProfile.name ? currentProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="text-left">
                <span className="font-bold block truncate max-w-[110px] sm:max-w-[140px]">
                  {currentProfile.name} ({currentProfile.demographics.age}y)
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">
                BMI {currentProfile.metrics.bmi}
              </span>
              <Sliders className="w-3 h-3 text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-900 dark:group-hover:text-emerald-200 ml-0.5 shrink-0" />
            </button>

            {/* Authentication / User Account Button */}
            {currentUser ? (
              <button
                id="header-user-account-btn"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700 dark:border-slate-700 shadow-2xs group cursor-pointer"
                title={`Logged in as ${currentUser.name} (${currentUser.email})`}
              >
                {currentUser.provider === 'facebook' ? (
                  <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center">
                    <Facebook className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center">
                    <Mail className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                id="header-signin-prompt-btn"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dark / Light Mode Theme Toggle Button */}
            <button
              id="header-theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 dark:text-amber-300 hover:text-slate-800 dark:hover:text-amber-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={darkMode ? 'Switch to Accessible Light Theme' : 'Switch to Dark Pastel Theme'}
              aria-label="Toggle theme mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
              )}
            </button>

            {/* Refresh / Reset Consultation Session */}
            <button
              id="header-reset-chat-btn"
              onClick={() => {
                setIsResetting(true);
                onResetConsultation();
                setTimeout(() => setIsResetting(false), 500);
              }}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
              title="Refresh & Start New Consultation Session"
              aria-label="Refresh consultation"
            >
              <RotateCcw className={`w-4 h-4 transition-transform duration-500 ${isResetting ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


