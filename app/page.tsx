'use client';

import React, { useState, useEffect, useRef } from 'react';
import { processCryptoAsync } from '@/lib/cryptoWorkerClient';
import { GlassCard } from '@/components/GlassCard';
import { MagneticButton } from '@/components/MagneticButton';
import { Lock, Unlock, Copy, Trash2, ArrowRight, Download, QrCode, FileText, Key, Share2, X as CloseIcon, Image as ImageIcon, ShieldCheck, Github, MoreVertical, Upload, Camera, Link as LinkIcon, Save, Bomb, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromImage, hideTextInImage } from '@/lib/stego';
import jsQR from 'jsqr';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Heavy component lazy-loaded (only loaded when QR button is clicked)
const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false,
  loading: () => <div className="w-[200px] h-[200px] flex items-center justify-center text-xs text-gray-500 bg-white/5 rounded-xl border border-white/10 animate-pulse">Loading engine...</div>,
});

export default function Home() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [output, setOutput] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stegoModalOpen, setStegoModalOpen] = useState(false);
  const [stegoPayload, setStegoPayload] = useState('');
  const [stegoCarrier, setStegoCarrier] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPanic, setIsPanic] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dual Image Encryption Mode
  const [imageMode, setImageMode] = useState<'stego' | 'full'>('stego');
  const [stagedImage, setStagedImage] = useState<{ data: string, name: string, type: string } | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Telemetry Stats
  const [cryptoTime, setCryptoTime] = useState(0);

  // Interactive Dummy Demo State
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const encodePlaceholders = ["Enter your secret...", "Drop a top-secret file...", "Drop an image to hide data..."];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // URL Hash Deep Linking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        try {
          const encodedData = decodeURIComponent(hash.replace('#data=', ''));
          setText(encodedData);
          setMode('decode');
          setHasInteracted(true);
          toast.success('Secure payload detected from URL! Ready to decrypt.');

          // Clean the URL so it doesn't stay in history
          window.history.replaceState(null, '', window.location.pathname);
        } catch {
          console.error("Failed to parse URL hash data");
        }
      }
    }
  }, []);

  // Live QR Scanner Logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startScanner = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
          await videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch {
        toast.error('Camera access denied or unavailable.');
        setShowQRScanner(false);
      }
    };

    const tick = () => {
      if (!videoRef.current || !canvasRef.current || !showQRScanner) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            setText(code.data);
            setMode('decode');
            setShowQRScanner(false);
            toast.success('QR Code successfully scanned and loaded!');
            return;
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (showQRScanner) {
      startScanner();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showQRScanner]);

  useEffect(() => {
    if (mode === 'decode') return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % encodePlaceholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mode, encodePlaceholders.length]);

  useEffect(() => {
    if (!output) {
      setDisplayedOutput('');
      setIsScrambling(false);
      return;
    }

    // Matrix Scramble Reveal Effect
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iteration = 0;
    const maxIterations = 15;
    const duration = 600; // ms
    const intervalTime = duration / maxIterations;

    const targetText = output;

    // Performance optimization: Don't scramble massive files
    if (targetText.length > 500) {
      setDisplayedOutput(targetText);
      setIsScrambling(false);
      return;
    }

    setIsScrambling(true);

    const interval = setInterval(() => {
      setDisplayedOutput(
        targetText
          .split('')
          .map((char, index) => {
            if (index < (iteration / maxIterations) * targetText.length) {
              return targetText[index];
            }
            if (char === ' ' || char === '\n') return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayedOutput(targetText);
        setIsScrambling(false);
      }

      iteration += 1;
    }, intervalTime);

    return () => {
      clearInterval(interval);
      setIsScrambling(false);
    };
  }, [output]);

  // Auto-detect Ciphertext
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasInteracted(true);
    const val = e.target.value;
    setText(val);

    if (mode === 'encode' && val.trim().startsWith('--- PHANTOM SECURE BLOCK')) {
      setMode('decode');
      toast.success('Locked message detected. Switched to Decode mode.');
    }
  };

  // Cryptographic Keystroke Feedback Effect
  const triggerKeystrokeAura = () => {
    const input = document.getElementById('password-input-aura');
    if (input) {
      input.animate([
        { opacity: 0.5, boxShadow: 'inset 0 0 20px rgba(99,102,241,0.5)' },
        { opacity: 0, boxShadow: 'inset 0 0 0px rgba(99,102,241,0)' }
      ], {
        duration: 300,
        easing: 'ease-out'
      });
    }
  };

  // Simple Password Strength Evaluator
  const handlePasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    triggerKeystrokeAura();
    const val = evt.target.value;
    setPassword(val);

    let strength = 0;
    if (val.length > 0) strength += 20;
    if (val.length >= 8) strength += 20;
    if (val.match(/[A-Z]/)) strength += 20;
    if (val.match(/[0-9]/)) strength += 20;
    if (val.match(/[^A-Za-z0-9]/)) strength += 20;

    setPasswordStrength(strength);
  };

  const handleProcess = async () => {
    if (!password) {
      toast.error('A password is required.');
      return;
    }

    if (!text && !stagedImage && !text.startsWith('[STEGO_CARRIER]')) {
      toast.error('Please provide data to lock.');
      return;
    }

    // Handle Staged Images first
    if (mode === 'encode' && stagedImage) {
      if (imageMode === 'stego') {
        setStegoCarrier(stagedImage.data);
        setStegoPayload('');
        setStegoModalOpen(true);
      } else {
        const fileData = `[PHANTOM_FILE:${stagedImage.name}:${stagedImage.type}]\n${stagedImage.data}`;
        await executeProcessing(fileData);
        setStagedImage(null);
      }
      return;
    }

    // Legacy fallback support
    if (mode === 'encode' && text.startsWith('[STEGO_CARRIER]\n')) {
      setStegoCarrier(text.replace('[STEGO_CARRIER]\n', ''));
      setStegoPayload('');
      setStegoModalOpen(true);
      return;
    }

    await executeProcessing(text);
  };

  const executeSteganography = async () => {
    if (!stegoPayload) {
      toast.error("Please enter a secret message.");
      return;
    }
    setStegoModalOpen(false);
    await executeProcessing(stegoPayload, true);
  };

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const executeProcessing = async (payloadData: string, isStego = false) => {
    setLoading(true);
    setOutput('');
    setShowQR(false);

    const startTime = performance.now();

    try {
      if (mode === 'encode') {
        const result = await processCryptoAsync('encode', payloadData, password);

        if (isStego) {
          toast.info('Injecting encrypted payload into image pixels...');
          const stegoImage = await hideTextInImage(result, stegoCarrier);

          const link = document.createElement('a');
          link.href = stegoImage;
          link.download = `phantom_stego_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setOutput("Steganography Successful. The encrypted payload is now hidden entirely within the pixels of the downloaded PNG image.\n\nTo decrypt, drag and drop the image back into the Phantom Vault.");
          toast.success('Image successfully weaponized.');
          setText('');
          setHasInteracted(false); // Reset demo mode
          setStegoCarrier('');
        } else {
          setOutput(result);
          toast.success('Message locked successfully.');
        }
      } else {
        const result = await processCryptoAsync('decode', payloadData, password);

        if (result.startsWith('[PHANTOM_FILE:')) {
          const endOfMetadata = result.indexOf(']\n');
          if (endOfMetadata !== -1) {
            const metadata = result.substring(1, endOfMetadata);
            const [, filename] = metadata.split(':');
            const base64Data = result.substring(endOfMetadata + 2);

            const link = document.createElement('a');
            link.href = base64Data;
            link.download = filename || `phantom_decrypted_${Date.now()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setOutput(`Successfully decrypted and downloaded file:\n${filename}`);
            toast.success('File extracted from Vault successfully.');
            setLoading(false);
            return;
          }
        }

        setOutput(result);
        toast.success('Message unlocked successfully.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'An error occurred during processing.');
    } finally {
      const endTime = performance.now();
      setCryptoTime(Math.round(endTime - startTime));
      triggerHaptic();
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    triggerHaptic();
    toast.success('Copied to clipboard!');
    setMobileMenuOpen(false);
  };

  const generateShareLink = () => {
    if (!output) return;
    const url = `${window.location.origin}/#data=${encodeURIComponent(output)}`;
    navigator.clipboard.writeText(url);
    triggerHaptic();
    toast.success('Secure Link copied! Anyone with the password can open this.');
    setMobileMenuOpen(false);
  };

  const handlePanic = () => {
    setIsPanic(true);
    setText('');
    setPassword('');
    setOutput('');
    setShowQR(false);
    setHasInteracted(false);
    setStagedImage(null);
    setStegoCarrier('');
    setStegoPayload('');
    setStegoModalOpen(false);
    setShowQRScanner(false);

    // Attempt to clear clipboard silently
    navigator.clipboard.writeText('--- PHANTOM MEMORY WIPED ---').catch(() => { });

    setTimeout(() => {
      setIsPanic(false);
      toast.success('Panic sequence complete. Local memory wiped.', { style: { background: '#ef4444', color: '#fff', border: 'none' } });
    }, 800);
  };

  const handleClear = () => {
    setText('');
    setPassword('');
    setOutput('');
    setShowQR(false);
    setHasInteracted(false);
    setStagedImage(null);
  };

  const downloadTxtFile = () => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `phantom_${mode}_${Date.now()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
    toast.success('File downloaded!');
  };

  const downloadVaultFile = () => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `secret_${Date.now()}.phantom`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Exported to Phantom Vault format!');
  };

  // --- File Drop Handlers for Phantom Vault ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    // Prevent massive files from crashing browser RAM
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Please keep Vault uploads under 5MB.');
      return;
    }

    setMode('encode');
    setLoading(true);

    try {
      const reader = new FileReader();

      // Intercept .phantom Vault files
      if (file.name.endsWith('.phantom')) {
        reader.onload = (event) => {
          if (event.target?.result) {
            setText(event.target.result as string);
            setMode('decode');
            toast.success('Phantom Vault file detected! Ready to unlock.');
            setLoading(false);
          }
        };
        reader.onerror = () => {
          toast.error('Failed to read Phantom Vault file.');
          setLoading(false);
        };
        reader.readAsText(file);
        return;
      }

      if (file.type.startsWith('image/')) {
        reader.onload = async (event) => {
          if (event.target?.result) {
            try {
              // ALWAYS attempt to extract ciphertext first (Decode scenario)
              const secret = await extractTextFromImage(event.target.result as string);
              if (secret && secret.startsWith('--- PHANTOM SECURE BLOCK')) {
                setText(secret);
                setMode('decode');
                toast.success('Hidden message found inside image! Set to Decode.');
                setLoading(false);
                return;
              }
            } catch {
              // Not a stego image (no hidden payload).
              // STAGE the image instead of dumping Base64 into the text box.
              setStagedImage({
                data: event.target.result as string,
                name: file.name,
                type: file.type
              });
              setText(''); // Clear main box
              toast.success('Image staged. Select your encryption preference below.');
              setLoading(false);
            }
          }
        };
      } else {
        // Standard Phantom Vault File
        reader.onload = (event) => {
          if (event.target?.result) {
            const fileData = `[PHANTOM_FILE:${file.name}:${file.type}]\n${event.target.result}`;
            setText(fileData);
            toast.success(`File loaded securely. Ready to lock.`);
            setLoading(false);
          }
        };
      }

      reader.onerror = () => {
        toast.error('Failed to read file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Error parsing file data.');
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-8"
    >

      {/* Header section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6 relative w-40 h-40 mx-auto">
          {/* Ambient Pulse Behind Image */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl rounded-[3rem] opacity-30"
            animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating Image Container */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-full h-full"
          >
            <Image src="/hero.webp" alt="Phantom Hero Illustration" fill className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] object-cover" priority />
          </motion.div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight sm:tracking-tighter">
          Military-Grade <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Encryption</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-base sm:text-lg pt-2 leading-relaxed px-4 sm:px-0">
          Phantom uses AES-256-GCM to lock your messages before they ever leave your device. <br className="hidden sm:block" />No servers. No databases. Zero trace.
        </p>
      </div>

      <div className="w-full max-w-7xl mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="w-full">
          <GlassCard className="w-full h-full">
            {/* Toggle Mode */}
            <div className="flex bg-black/40 p-1.5 rounded-full mb-8 relative shadow-inner border border-white/5 mx-auto max-w-md">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-transform duration-300 ease-out shadow-lg shadow-indigo-500/25 ${mode === 'encode' ? 'translate-x-0' : 'translate-x-[calc(100%+12px)]'
                  }`}
              />
              <button
                onClick={() => { setMode('encode'); setOutput(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full z-10 font-semibold transition-colors ${mode === 'encode' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Lock className="w-4 h-4" /> Lock
              </button>
              <button
                onClick={() => { setMode('decode'); setOutput(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full z-10 font-semibold transition-colors ${mode === 'decode' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Unlock className="w-4 h-4" /> Unlock
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-6">
              <div className="space-y-2 relative group">
                {/* Dynamic Animated Border Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                <div className="flex items-center justify-between mb-2 sm:mb-4 px-1 relative z-20">
                  <label className="text-sm font-semibold text-indigo-200">
                    {mode === 'encode' ? (stagedImage ? 'Image Stager' : 'Data to Lock') : 'Data to Unlock'}
                  </label>
                  <div className="flex items-center gap-3">
                    {stagedImage && (
                      <button
                        onClick={() => setStagedImage(null)}
                        className="text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors"
                      >
                        Clear Image
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-full border border-indigo-500/30 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      title="Upload Image/File"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Upload</span>
                    </button>
                    {mode === 'decode' && (
                      <button
                        onClick={() => setShowQRScanner(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/40 px-3 py-1.5 rounded-full border border-emerald-500/30 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        title="Scan QR Code"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Scan QR</span>
                        <span className="sm:hidden">Scan</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative w-full z-10">
                  <AnimatePresence mode="popLayout">
                    {mode === 'encode' && !text && !isDragging && !hasInteracted && !isFocused && !stagedImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-[3px] pointer-events-none z-20 flex items-start justify-start p-5 overflow-hidden"
                      >
                        <span className="text-gray-500/50 font-mono text-base sm:text-lg select-none">
                          My secret bank pin is 8492. Do not share...
                        </span>
                      </motion.div>
                    )}
                    {mode === 'encode' && !text && !isDragging && (hasInteracted || isFocused) && !stagedImage && (
                      <motion.span
                        key={placeholderIdx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-[21px] top-[21px] text-gray-500 pointer-events-none text-base sm:text-lg font-mono"
                      >
                        {encodePlaceholders[placeholderIdx]}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!stagedImage ? (
                    <textarea
                      value={text}
                      onChange={handleTextChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      placeholder={mode === 'decode' ? "Paste the locked message code or drop an image..." : ""}
                      className={`w-full h-36 relative ${isDragging ? 'bg-indigo-500/10 border-indigo-400 scale-[1.02]' : 'bg-black/80 border-white/10'} border-2 border-dashed sm:border-solid sm:border rounded-2xl p-5 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] font-mono resize-none transition-all leading-relaxed backdrop-blur-md z-10`}
                    />
                  ) : (
                    <div
                      className="w-full h-36 relative bg-indigo-500/5 border-2 border-indigo-500/30 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 z-10"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <ImageIcon className="w-8 h-8 text-indigo-400 opacity-80" />
                      <div className="text-center">
                        <p className="text-indigo-200 font-bold mb-1 truncate max-w-xs">{stagedImage.name}</p>
                        <p className="text-xs text-indigo-400/60">Image successfully staged for processing</p>
                      </div>
                    </div>
                  )}
                </div>

                {isDragging && !stagedImage && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-6">
                    <div className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                      Drop into Vault
                    </div>
                  </div>
                )}
              </div>

              {/* Image Processing Mode Toggle (Hidden until Staged) */}
              {mode === 'encode' && stagedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  className="mb-6 space-y-3 bg-black/40 border border-indigo-500/20 p-4 rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                  <label className="text-sm font-semibold text-indigo-300 block">Select Processing Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                    <button
                      onClick={() => setImageMode('stego')}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all ${imageMode === 'stego' ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-inner shadow-indigo-500/20' : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.05] hover:border-white/20'}`}
                    >
                      <span className="font-bold text-sm">Steganography</span>
                      <span className="text-xs opacity-70 mt-1">Hide text inside image</span>
                    </button>
                    <button
                      onClick={() => setImageMode('full')}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all ${imageMode === 'full' ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-inner shadow-indigo-500/20' : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.05] hover:border-white/20'}`}
                    >
                      <span className="font-bold text-sm">Full Encryption</span>
                      <span className="text-xs opacity-70 mt-1">Encrypt image file itself</span>
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2 relative">
                {/* Ambient Aura overlay for keystrokes */}
                <div id="password-input-aura" className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0" />

                <label className="text-sm font-semibold text-indigo-200 ml-1 block">Secret Key (Password)</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a strong password..."
                  className="w-full relative z-10 bg-black/80 border border-white/10 rounded-2xl p-5 text-base sm:text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] transition-all font-mono tracking-wider"
                />
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-500 ${passwordStrength <= 20 ? 'bg-red-500 w-[20%]' :
                        passwordStrength <= 40 ? 'bg-orange-500 w-[40%]' :
                          passwordStrength <= 60 ? 'bg-yellow-500 w-[60%]' :
                            passwordStrength <= 80 ? 'bg-emerald-400 w-[80%]' :
                              'bg-cyan-400 w-full'
                        }`}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <MagneticButton
                  onClick={handleProcess}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 text-lg transition-colors disabled:opacity-50 disabled:pointer-events-none group shadow-[0_0_20px_rgba(99,102,241,0.3)] shadow-indigo-500/25 z-20"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'encode' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                      {mode === 'encode' ? 'Lock Now' : 'Unlock Now'}
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </MagneticButton>

                <MagneticButton
                  onClick={handleClear}
                  className="p-5 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center justify-center shadow-inner sm:w-16 z-20"
                >
                  <Trash2 className="w-6 h-6" />
                  <span className="ml-2 sm:hidden font-semibold">Clear</span>
                </MagneticButton>
              </div>

              {/* Live Verification Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 select-none">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400/80 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  Local Process
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300/80 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AES-256-GCM
                </div>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-full border border-white/10 cursor-pointer">
                  <Github className="w-3.5 h-3.5" />
                  Open-Source
                </a>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Output Section */}
        <div className="w-full flex-1">
          <AnimatePresence mode="popLayout">
            {output ? (
              <motion.div
                initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px) brightness(2)', transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-2xl overflow-hidden origin-top"
              >
                <div className="bg-black/60 border border-indigo-500/20 rounded-3xl p-2 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.15)] mt-2 relative overflow-hidden group">
                  {/* Inner edge highlight */}
                  <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-white/5 gap-4 sm:gap-0">
                    <span className="text-xs sm:text-sm font-semibold text-indigo-300 tracking-widest uppercase">
                      {mode === 'encode' ? 'Locked Secret Code' : 'Unlocked Message'}
                    </span>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex flex-wrap gap-2 relative z-10">
                      {mode === 'encode' && (
                        <button
                          onClick={downloadVaultFile}
                          className="flex items-center gap-2 text-xs font-medium text-emerald-300 hover:text-white transition-colors bg-emerald-500/10 hover:bg-emerald-500/30 px-3 py-1.5 rounded-md border border-emerald-500/30 shadow-md"
                          title="Export to .phantom Vault File"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>.phantom</span>
                        </button>
                      )}
                      <button
                        onClick={generateShareLink}
                        className="flex items-center gap-2 text-xs font-medium text-indigo-300 hover:text-white transition-colors bg-indigo-500/10 hover:bg-indigo-500/30 px-3 py-1.5 rounded-md border border-indigo-500/30 shadow-md"
                        title="Generate Secure Link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </button>
                      <button
                        onClick={() => setShowQR(!showQR)}
                        className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                        title="Show QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR</span>
                      </button>
                      <button
                        onClick={downloadTxtFile}
                        className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                        title="Download TXT"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>TXT</span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-xs font-medium text-white transition-colors bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 px-3 py-1.5 rounded-md shadow-lg"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>

                    {/* Mobile Actions Menu Toggle */}
                    <div className="sm:hidden absolute top-3 right-3 z-10">
                      <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full border border-white/10"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showQR && (
                    <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col items-center justify-center bg-black/40">
                      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <QRCodeSVG value={output} size={200} level="M" includeMargin={false} className="w-40 h-40 sm:w-50 sm:h-50" />
                      </div>
                      <p className="mt-4 text-xs font-medium text-indigo-300/70 tracking-wide uppercase text-center">Scan to extract payload</p>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 relative max-w-full">
                    <p className={`font-mono text-xs sm:text-sm md:text-base break-all select-all leading-relaxed max-h-60 overflow-y-auto w-full custom-scrollbar transition-colors duration-300 ${isScrambling ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-gray-300'}`}>
                      {displayedOutput}
                    </p>
                  </div>

                  {/* Cryptographic Telemetry Stats */}
                  <div className="px-5 py-3 border-t border-white/5 bg-black/40 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-indigo-400/60 font-mono uppercase tracking-widest gap-2">
                    <div className="flex items-center gap-4">
                      <span>⏱️ Time: <span className="text-white/80 font-bold">{cryptoTime}ms</span></span>
                      <span className="hidden sm:inline">|</span>
                      <span>🔒 Algo: <span className="text-white/80 font-bold">AES-GCM (256-bit)</span></span>
                      <span className="hidden md:inline">|</span>
                      <span className="hidden md:inline">🔄 Derivation: <span className="text-white/80 font-bold">PBKDF2 (100k)</span></span>
                    </div>
                    <div>Status: <span className="text-emerald-400 font-bold">SECURED</span></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex flex-col items-center justify-center h-full min-h-[400px] border border-white/5 rounded-3xl bg-white/[0.01] text-gray-500"
              >
                <Lock className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-sm uppercase tracking-widest text-center">Output Area</p>
                <p className="text-xs mt-2 opacity-50">Locked or unlocked data will appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Supported Formats Marquee */}
      <div className="w-full max-w-4xl pt-8 pb-4 px-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none" />
        <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-6">Built To Secure Any Payload</p>

        <div className="flex animate-[marquee_20s_linear_infinite] w-max gap-8 md:gap-16 items-center flex-nowrap opacity-60 hover:opacity-100 transition-opacity">
          {/* Double the items to create a seamless infinite scroll effect */}
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm whitespace-nowrap"><FileText className="w-4 h-4 text-indigo-400" /> TEXT MESSAGES</div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm whitespace-nowrap"><FileText className="w-4 h-4 text-rose-400" /> PDF DOCUMENTS</div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm whitespace-nowrap"><ImageIcon className="w-4 h-4 text-emerald-400" /> PNG / JPG CARRIERS</div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm whitespace-nowrap"><FileText className="w-4 h-4 text-cyan-400" /> JSON PAYLOADS</div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm whitespace-nowrap"><Key className="w-4 h-4 text-yellow-500" /> MNEMONIC SEEDS</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Simple How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-4xl pt-16 pb-8 px-2 sm:px-0"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-white tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-5 p-6 sm:p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 rotate-3 shadow-lg shadow-indigo-500/10">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">1. Write Message</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Type the secret message you want to send in the box above.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-5 p-6 sm:p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all hover:-translate-y-1 delay-75">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 -rotate-3 shadow-lg shadow-violet-500/10">
              <Key className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">2. Add Password</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Choose a password. Only someone with this exact password can read the message.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-5 p-6 sm:p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all hover:-translate-y-1 delay-150">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 rotate-3 shadow-lg shadow-cyan-500/10">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">3. Share the Code</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Lock it, copy the scrambled code, and share it safely anywhere.</p>
          </div>
        </div>
      </motion.div>

      {/* NEW: Dual Image Encryption Section (Migrated from How It Works) */}
      <div className="text-center space-y-6 pt-16 sm:pt-20 px-4 w-full max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex justify-center items-center gap-3 tracking-tight">
          <ImageIcon className="text-indigo-400 w-8 h-8" />
          Advanced Image Handling
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Phantom features a powerful Dual Image Encryption Engine. When you upload an image to the Vault, you control exactly how it is secured.
        </p>
      </div>

      <GlassCard className="w-full max-w-4xl mx-auto px-5 py-8 sm:px-10 sm:py-12 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-white">
          <ShieldCheck className="w-48 h-48" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <div className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">1. Steganography</h3>
            <p className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">Hide Text Inside an Image</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Phantom injects your scrambled secret message directly into the pixel data of an innocent-looking picture.
              The image looks 100% normal to the human eye, but acts as a carrier for your secret.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">2. Full Encryption</h3>
            <p className="text-cyan-300 font-semibold text-sm uppercase tracking-wider">Lock the Image Itself</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Phantom converts the entire image file into a massive string of data and encrypts the whole thing using AES-256-GCM.
              The picture is completely destroyed until the correct Secret Key reconstructs it on the other side.
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-12 overflow-x-auto bg-black/40 border border-white/10 rounded-2xl w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-gray-300">Mode</th>
                <th className="p-4 text-sm font-semibold text-gray-300 hidden sm:table-cell">How it Works</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Visual Output</th>
                <th className="p-4 text-sm font-semibold text-gray-300 hidden md:table-cell">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-indigo-400">Steganography</td>
                <td className="p-4 text-gray-400 hidden sm:table-cell">Hides text mathematically in pixel LSBs</td>
                <td className="p-4 text-gray-300">Looks identical to original</td>
                <td className="p-4 text-gray-400 hidden md:table-cell">Passing messages in plain sight</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-cyan-400">Full Encryption</td>
                <td className="p-4 text-gray-400 hidden sm:table-cell">Scrambles the entire raw file into ciphertext</td>
                <td className="p-4 text-gray-300">Unreadable text block (.txt)</td>
                <td className="p-4 text-gray-400 hidden md:table-cell">Archiving or locking images completely</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRScanner(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#050510] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden flex flex-col items-center"
            >
              <div className="absolute top-0 right-0 p-4 z-10">
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-2 rounded-full"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                <Camera className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 text-center">Live Scanner</h3>
              <p className="text-gray-400 text-sm leading-relaxed text-center mb-6">
                Point your camera at a Phantom QR code to instantly load the encrypted payload.
              </p>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black/50">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {/* Scanner Target Guide */}
                <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full border-2 border-emerald-400/80 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Steganography Weaponize Modal */}
      <AnimatePresence>
        {stegoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStegoModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#050510] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setStegoModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
                  <ImageIcon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Weaponize Image</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Carrier image loaded successfully. What secret message or payload would you like to encrypt and hide inside its pixels?
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={stegoPayload}
                    onChange={(e) => setStegoPayload(e.target.value)}
                    placeholder="Enter top-secret payload..."
                    className="w-full h-32 bg-black/80 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] font-mono resize-none transition-all leading-relaxed"
                  />

                  <MagneticButton
                    onClick={executeSteganography}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-lg transition-colors shadow-lg shadow-indigo-500/25 z-20"
                  >
                    <Lock className="w-5 h-5" />
                    Inject & Download
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet Actions Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-[#09090b] border-t border-white/10 rounded-t-3xl p-6 relative z-10 pb-10"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

              <h3 className="text-lg font-bold text-white mb-6">Actions</h3>

              <div className="flex flex-col gap-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/20 text-indigo-100 border border-indigo-500/30"
                >
                  <Copy className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-lg">Copy to Clipboard</span>
                </button>

                {mode === 'encode' && (
                  <button
                    onClick={downloadVaultFile}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                  >
                    <Save className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-lg">Export to .phantom</span>
                  </button>
                )}

                <button
                  onClick={generateShareLink}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/10 text-indigo-200 border border-indigo-500/20"
                >
                  <LinkIcon className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-lg">Share via Link</span>
                </button>

                <button
                  onClick={() => { setShowQR(!showQR); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-200 border border-white/10"
                >
                  <QrCode className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-lg">Generate QR Code</span>
                </button>

                <button
                  onClick={() => { downloadTxtFile(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-200 border border-white/10"
                >
                  <Download className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-lg">Download as TXT</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Panic Button */}
      <button
        onClick={handlePanic}
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center p-4 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 rounded-full text-red-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] backdrop-blur-md group overflow-hidden"
        title="Emergency Memory Wipe"
      >
        <Bomb className="w-5 h-5 z-10" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] whitespace-nowrap ml-0 group-hover:ml-3 font-bold text-sm tracking-widest uppercase z-10">
          Panic Wipe
        </span>
      </button>

      {/* Panic Overlay Flash */}
      <AnimatePresence>
        {isPanic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[1000] bg-red-600 mix-blend-overlay pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
