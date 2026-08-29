import React, { useState, useRef, useEffect } from 'react';
import { AttachmentItem } from '../types';
import { unlockBrowserAudioContext } from '../utils/notifications';
import {
  Send,
  Paperclip,
  Camera,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Globe,
  Link2,
  CheckCircle2,
} from 'lucide-react';

interface InputToolbarProps {
  onSendMessage: (message: string, attachments: AttachmentItem[]) => void;
  isLoading: boolean;
  onOpenSampleScenarios: () => void;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  onSendMessage,
  isLoading,
  onOpenSampleScenarios,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Web URL modal state
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  // Setup Speech Recognition with robust error and permission handling
  useEffect(() => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => (result as any)[0]?.transcript || '')
            .join('');
          if (transcript) {
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          setIsRecordingVoice(false);
          const errType = event?.error;
          if (errType === 'not-allowed') {
            setVoiceNotice('Microphone access blocked. Please enable microphone permission in browser settings.');
            setTimeout(() => setVoiceNotice(null), 5000);
          }
        };

        recognition.onend = () => {
          setIsRecordingVoice(false);
        };

        recognitionRef.current = recognition;
      }
    } catch {
      // Ignored
    }
  }, []);

  const toggleVoiceRecording = async () => {
    // Proactively prime audio context on user gesture
    unlockBrowserAudioContext().catch(() => {});

    if (!recognitionRef.current) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please type your message.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isRecordingVoice) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored
      }
      setIsRecordingVoice(false);
    } else {
      try {
        setVoiceNotice(null);
        recognitionRef.current.start();
        setIsRecordingVoice(true);
      } catch {
        setIsRecordingVoice(false);
      }
    }
  };

  // Start Camera for symptom capture
  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please check permissions or upload a saved photo instead.');
      setIsCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const newAttachment: AttachmentItem = {
      id: `cam_${Date.now()}`,
      name: `Symptom_Photo_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`,
      type: 'image',
      mimeType: 'image/jpeg',
      data: dataUrl,
      previewUrl: dataUrl,
      fileSize: 'Snapshot',
      category: 'rash',
    };

    setAttachments((prev) => [...prev, newAttachment]);
    handleStopCamera();
  };

  const handleStopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Helper to compress and downscale images on client-side for rapid network transfer and AI processing
  const compressImage = (file: File): Promise<{ dataUrl: string; fileSizeStr: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawData = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            const kb = Math.round((compressed.length * 3) / 4 / 1024);
            resolve({ dataUrl: compressed, fileSizeStr: `${kb} KB (Optimized)` });
            return;
          }
          resolve({ dataUrl: rawData, fileSizeStr: `${(file.size / 1024).toFixed(0)} KB` });
        };
        img.onerror = () => {
          resolve({ dataUrl: rawData, fileSizeStr: `${(file.size / 1024).toFixed(0)} KB` });
        };
        img.src = rawData;
      };
      reader.onerror = () => {
        resolve({ dataUrl: '', fileSizeStr: '0 KB' });
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle File Uploads (Drag & Drop or Manual selection)
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type.includes('pdf');

      let dataUrl = '';
      let fileSizeStr = `${(file.size / 1024).toFixed(0)} KB`;

      if (isImg) {
        const compressed = await compressImage(file);
        dataUrl = compressed.dataUrl;
        fileSizeStr = compressed.fileSizeStr;
      } else {
        dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      }

      if (!dataUrl) return;

      const newAttachment: AttachmentItem = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        type: isImg ? 'image' : 'document',
        mimeType: isImg ? 'image/jpeg' : (file.type || (isPdf ? 'application/pdf' : 'text/plain')),
        data: dataUrl,
        previewUrl: isImg ? dataUrl : '',
        fileSize: fileSizeStr,
        category: file.name.toLowerCase().includes('blood') || file.name.toLowerCase().includes('lab')
          ? 'lab_report'
          : file.name.toLowerCase().includes('rash') || isImg
          ? 'rash'
          : 'general',
      };
      setAttachments((prev) => [...prev, newAttachment]);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAttachUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInputValue.trim()) return;
    const url = urlInputValue.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('Please enter a full URL starting with http:// or https://');
      return;
    }

    setIsFetchingUrl(true);
    setUrlError(null);

    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const isImg = result.data.type === 'image';
        const item: AttachmentItem = {
          id: `web_${Date.now()}`,
          name: result.data.title || url.replace(/^https?:\/\//, ''),
          type: isImg ? 'image' : 'document',
          mimeType: result.data.mimeType || 'text/html',
          data: result.data.data ? `data:${result.data.mimeType};base64,${result.data.data}` : url,
          previewUrl: result.data.data ? `data:${result.data.mimeType};base64,${result.data.data}` : '',
          fileSize: 'External Web File',
          category: isImg ? 'rash' : 'general',
        };
        setAttachments((prev) => [...prev, item]);
        setUrlInputValue('');
        setIsUrlModalOpen(false);
      } else {
        setUrlError(result.error || 'Failed to fetch the URL. Make sure it is public.');
      }
    } catch {
      setUrlError('Network error while attempting to reach the link.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isLoading) return;

    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-teal-100/90 dark:border-slate-800 p-3 sm:p-4 sticky bottom-0 z-10 shadow-xs transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Camera Live Modal Overlay */}
        {isCameraActive && (
          <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 text-white flex flex-col items-center gap-3 shadow-xl">
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs flex items-center gap-1.5 text-teal-300">
                <Camera className="w-4 h-4" /> Live Camera Symptom Capture (Hold still and ensure good lighting)
              </span>
              <button
                type="button"
                onClick={handleStopCamera}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-4/3 relative border border-slate-700">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="capture-symptom-photo-btn"
                onClick={handleCaptureSnapshot}
                className="px-5 py-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Capture Symptom Photo
              </button>
              <button
                type="button"
                onClick={handleStopCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Attachments Preview Carousel */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-teal-50/50 dark:bg-slate-800/80 rounded-2xl border border-teal-100 dark:border-slate-700">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-700 shadow-2xs relative group"
              >
                {att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-lg flex items-center justify-center border border-teal-100 dark:border-teal-800/60">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="max-w-[140px]">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">{att.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    {att.fileSize} • {att.category === 'rash' ? 'Skin/Visual' : 'Lab Document'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice Dictation Notification */}
        {voiceNotice && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="grow">{voiceNotice}</span>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="p-1 text-amber-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Form & Drag Area */}
        <form
          onSubmit={handleFormSubmit}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-2xl border transition-all ${
            dragActive
              ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/60 ring-2 ring-teal-300/50'
              : 'border-teal-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 focus-within:border-teal-500 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-200/60 dark:focus-within:ring-teal-900/40 shadow-2xs'
          }`}
        >
          {dragActive && (
            <div className="absolute inset-0 bg-teal-500/10 rounded-2xl flex items-center justify-center z-20 pointer-events-none">
              <span className="bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md">
                Drop medical files / symptom images here
              </span>
            </div>
          )}

          <div className="p-2.5 sm:p-3">
            <textarea
              ref={textareaRef}
              id="pulsehealth-message-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
              rows={2}
              placeholder="Describe your symptoms (e.g. 'I noticed an itchy red rash on my arm after gardening' or 'My fasting glucose came back high')..."
              className="w-full text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent resize-none outline-hidden min-h-[44px]"
            />

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                {/* File picker button */}
                <button
                  type="button"
                  id="attach-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 hover:bg-teal-50/80 dark:hover:bg-slate-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  title="Upload photo of rash, eye, or lab report (JPEG/PNG/PDF)"
                >
                  <Paperclip className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Attach File / Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="hidden-file-input"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => processFiles(e.target.files)}
                  className="hidden"
                />

                {/* Camera Symptom Capture */}
                <button
                  type="button"
                  id="open-camera-btn"
                  onClick={handleStartCamera}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 hover:bg-teal-50/80 dark:hover:bg-slate-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  title="Take photo of rash, eye redness, or lesion"
                >
                  <Camera className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Camera</span>
                </button>

                {/* Voice Dictation */}
                <button
                  type="button"
                  id="voice-dictate-btn"
                  onClick={toggleVoiceRecording}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 animate-pulse border border-rose-200 dark:border-rose-800'
                      : 'text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 hover:bg-teal-50/80 dark:hover:bg-slate-800'
                  }`}
                  title={isRecordingVoice ? 'Stop recording voice' : 'Speak your symptoms'}
                >
                  {isRecordingVoice ? (
                    <>
                      <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span className="text-[11px] font-bold">Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span className="hidden sm:inline">Voice</span>
                    </>
                  )}
                </button>
                {/* Web Link / Internet URL Input */}
                <button
                  type="button"
                  id="attach-url-btn"
                  onClick={() => {
                    setIsUrlModalOpen(!isUrlModalOpen);
                    setUrlError(null);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isUrlModalOpen
                      ? 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-100 ring-1 ring-teal-400'
                      : 'text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 hover:bg-teal-50/80 dark:hover:bg-slate-800'
                  }`}
                  title="Import external medical article, online report, or web image URL"
                >
                  <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Web Link</span>
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  id="send-consultation-btn"
                  disabled={(!inputText.trim() && attachments.length === 0) || isLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze &amp; Triage</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Web URL Fetching Modal Overlay */}
            {isUrlModalOpen && (
              <div className="mt-3 p-3 bg-teal-50/90 dark:bg-slate-800/90 rounded-xl border border-teal-200 dark:border-slate-700 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Import External Medical URL or Internet File
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsUrlModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    id="external-url-input"
                    value={urlInputValue}
                    onChange={(e) => setUrlInputValue(e.target.value)}
                    placeholder="https://example.com/medical-study or https://...image.jpg"
                    className="grow px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAttachUrl(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAttachUrl}
                    disabled={isFetchingUrl || !urlInputValue.trim()}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isFetchingUrl ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Attach</span>
                      </>
                    )}
                  </button>
                </div>
                {urlError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {urlError}
                  </p>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Tip: You can also paste links directly into your question (e.g. PubMed articles, FDA/CDC bulletins, or cloud report links).
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Quick prompt suggestions in light & dark pastel tone + RAG Status */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Quick scenarios:</span>
            <button
              type="button"
              onClick={() =>
                setInputText(
                  'I have had an itchy circular red patch with raised edges on my forearm for 2 days. It gets worse after heat.'
                )
              }
              className="px-2.5 py-1 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-900 dark:text-teal-200 border border-teal-200/70 dark:border-teal-800/70 rounded-lg transition-colors font-medium cursor-pointer"
            >
              🔍 Annular Rash &amp; Itching
            </button>
            <button
              type="button"
              onClick={() =>
                setInputText(
                  'My recent blood report shows Fasting Blood Sugar at 118 mg/dL and HbA1c at 5.9%. What does this mean for my sedentary desk job?'
                )
              }
              className="px-2.5 py-1 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-800/70 rounded-lg transition-colors font-medium cursor-pointer"
            >
              📊 Pre-Diabetes Lab Review
            </button>
            <button
              type="button"
              onClick={() =>
                setInputText(
                  'I feel crushing, tight pain in the middle of my chest radiating down my left arm, along with sudden shortness of breath.'
                )
              }
              className="px-2.5 py-1 bg-rose-50/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200/70 dark:border-rose-800/70 font-medium rounded-lg transition-colors cursor-pointer"
            >
              🚨 Severe Chest Tightness
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RAG Grounding: PubMed / CDC / WHO Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

