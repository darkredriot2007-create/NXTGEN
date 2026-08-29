import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileSearch,
  BellRing,
  Stethoscope,
  HeartPulse,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  Volume2,
} from 'lucide-react';
import { MedtrackLogo } from './MedtrackLogo';
import { unlockBrowserAudioContext, playNotificationRingtone } from '../utils/notifications';
import { UserProfile } from '../types';

interface OpeningScreenProps {
  onStartConsultation: () => void;
  onOpenProfile: () => void;
  onOpenReminders: () => void;
  userProfile?: UserProfile;
  onDismissForever?: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStartConsultation,
  onOpenProfile,
  onOpenReminders,
  userProfile,
}) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [hasTestedAudio, setHasTestedAudio] = useState(false);

  const features = [
    {
      title: 'Multimodal AI Vision & Lab Triage',
      desc: 'Upload photos of skin rashes or laboratory blood test reports for instant OCR biomarker analysis and clinical assessment.',
      icon: FileSearch,
      tag: 'Vision & OCR',
      color: 'teal',
    },
    {
      title: 'Personalized Clinical Baseline',
      desc: 'Calculate precise BMI, basal metabolic rate, and hydration metrics tailored to your age, profession, and health history.',
      icon: Activity,
      tag: 'Biometrics',
      color: 'emerald',
    },
    {
      title: 'Scheduled Reminders & Custom Music',
      desc: 'Set daily health check-ins and upload your favorite custom MP3 alarms with automated browser audio unlock.',
      icon: BellRing,
      tag: 'Smart Alarms',
      color: 'cyan',
    },
    {
      title: 'Real-Time Evidence Grounding',
      desc: 'Access verified clinical citations from WHO, CDC, PubMed, and NIH MedlinePlus with emergency red-flag safeguards.',
      icon: ShieldCheck,
      tag: 'Clinical Safety',
      color: 'teal',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

  const handleTestAudioSample = async () => {
    await unlockBrowserAudioContext();
    playNotificationRingtone('harmonic_chime', 2, 0.8);
    setHasTestedAudio(true);
  };

  return (
    <div
      id="medtrack-opening-screen"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <MedtrackLogo size={42} animated />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-outfit">
                  MedTrack <span className="text-teal-600 dark:text-teal-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  PulseHealth AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Track &bull; Aware &bull; Stay Healthy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartConsultation}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Skip to App &rarr;
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Hero Greeting & Central Logo Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>MedTrack AI &bull; PulseHealth AI System</span>
            </div>

            {/* Central Animated Hero Logo Container */}
            <div className="relative my-2 p-6 bg-linear-to-b from-teal-50/50 to-emerald-50/30 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl border border-teal-100 dark:border-slate-800 flex items-center justify-center shadow-inner group">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-teal-500/5 via-emerald-500/5 to-teal-500/5 group-hover:opacity-100 transition-opacity" />
              <MedtrackLogo size={140} animated />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
              Your Personal AI Public Health Assistant
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-md">
              MedTrack AI and PulseHealth AI combine multimodal visual diagnostics, biomarker laboratory OCR, and customized health reminder alarms to help you stay ahead of health risks.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                id="opening-start-btn"
                type="button"
                onClick={onStartConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all cursor-pointer transform active:scale-98"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Start Health Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="opening-profile-btn"
                type="button"
                onClick={onOpenProfile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{userProfile?.name ? `Patient: ${userProfile.name}` : 'Setup Health Profile'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Key Interactive Modules & Sound Unlock */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Core Capabilities &amp; Features
            </div>

            {/* Interactive Feature Accordion Cards */}
            <div className="space-y-2.5">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                const isActive = activeFeatureIndex === idx;
                return (
                  <div
                    key={feature.title}
                    onClick={() => setActiveFeatureIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-linear-to-r from-teal-50/80 to-emerald-50/80 dark:from-teal-950/40 dark:to-emerald-950/30 border-teal-300 dark:border-teal-700 shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isActive
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {feature.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 shrink-0">
                            {feature.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Browser Audio Policy & Custom Tone Sound Card */}
            <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-950 dark:text-emerald-200">
                    Custom Alarms &amp; Sound Engine
                  </div>
                  <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                    {hasTestedAudio ? 'Audio context unlocked & ready' : 'Tap to test sound channel & unlock custom MP3s'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestAudioSample}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{hasTestedAudio ? 'Play Again' : 'Test Tone'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status & Safety Disclaimer Footer */}
        <div className="relative z-10 px-6 sm:px-8 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Medtrack Clinical Protocols &bull; Real-time AI Triage</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenReminders}
              className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition-colors cursor-pointer"
            >
              Daily Reminder Settings
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={onStartConsultation}
              className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Enter Dashboard &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
