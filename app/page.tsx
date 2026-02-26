'use client';

import { useState } from 'react';
import { processCryptoAsync } from '@/lib/cryptoWorkerClient';
import { GlassCard } from '@/components/GlassCard';
import { Lock, Unlock, Copy, Trash2, ArrowRight, Download, QrCode, FileText, Key, Share2 } from 'lucide-react';
import { extractTextFromImage, hideTextInImage } from '@/lib/stego';
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
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-detect Ciphertext
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (mode === 'encode' && val.trim().startsWith('--- PHANTOM SECURE BLOCK')) {
      setMode('decode');
      setSuccess('Locked message detected. Switched to Decode mode.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Simple Password Strength Evaluator
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
      setError('A password is required.');
      return;
    }

    if (!text && !text.startsWith('[STEGO_CARRIER]')) {
      setError('Please provide data to lock.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setOutput('');
    setShowQR(false);

    try {
      if (mode === 'encode') {
        let payloadData = text;
        let isStego = false;
        let carrierSrc = '';

        // Handle Steganography encoding
        if (text.startsWith('[STEGO_CARRIER]\n')) {
          isStego = true;
          carrierSrc = text.replace('[STEGO_CARRIER]\n', '');
          const userSecret = window.prompt("Image carrier loaded. What secret message or data do you want to hide inside this image?");
          if (!userSecret) {
            setLoading(false);
            return; // User cancelled
          }
          payloadData = userSecret;
        }

        const result = await processCryptoAsync('encode', payloadData, password);

        if (isStego) {
          setSuccess('Encrypting payload and injecting it into image pixels...');
          const stegoImage = await hideTextInImage(result, carrierSrc);

          // Auto-download the new weaponized image
          const link = document.createElement('a');
          link.href = stegoImage;
          link.download = `phantom_stego_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setOutput("Steganography Successful. The encrypted payload is now hidden entirely within the pixels of the downloaded PNG image.\n\nTo decrypt, drag and drop the image back into the Phantom Vault.");
          setSuccess('Image successfully weaponized.');
        } else {
          setOutput(result);
          setSuccess('Message locked successfully.');
        }
      } else {
        const result = await processCryptoAsync('decode', text, password);

        // Check if the decrypted payload is actually a Phantom Vault File
        if (result.startsWith('[PHANTOM_FILE:')) {
          const endOfMetadata = result.indexOf(']\n');
          if (endOfMetadata !== -1) {
            const metadata = result.substring(1, endOfMetadata);
            const [, filename] = metadata.split(':');
            const base64Data = result.substring(endOfMetadata + 2);

            // Trigger auto-download of the extracted file
            const link = document.createElement('a');
            link.href = base64Data;
            link.download = filename || `phantom_decrypted_${Date.now()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setOutput(`Successfully decrypted and downloaded file:\n${filename}`);
            setSuccess('File extracted from Vault successfully.');
            setLoading(false);
            return;
          }
        }

        setOutput(result);
        setSuccess('Message unlocked successfully.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleClear = () => {
    setText('');
    setPassword('');
    setOutput('');
    setError('');
    setSuccess('');
    setShowQR(false);
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
    setSuccess('File downloaded!');
    setTimeout(() => setSuccess(''), 2000);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Prevent massive files from crashing browser RAM
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Please keep Vault uploads under 5MB.');
        return;
      }

      setMode('encode');
      setLoading(true);
      setError('');
      setSuccess(`Processing ${file.name}...`);

      try {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
          // If it's an image, let's treat it as a Steganography Carrier!
          reader.onload = async (event) => {
            if (event.target?.result) {
              try {
                // Attempt to extract existing hidden ciphertext first
                const secret = await extractTextFromImage(event.target.result as string);
                if (secret && secret.startsWith('--- PHANTOM SECURE BLOCK')) {
                  setText(secret);
                  setMode('decode');
                  setSuccess('Hidden message found inside image! Set to Decode.');
                  setLoading(false);
                  return;
                }
              } catch {
                // Not a stego image, meaning they want to hide data IN it later.
                // We'll place the dataURL in state with a special tag.
                setText(`[STEGO_CARRIER]\n${event.target.result}`);
                setSuccess('Carrier image ready. Enter text to hide inside it.');
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
              setSuccess(`File loaded securely. Ready to lock.`);
              setLoading(false);
            }
          };
        }

        reader.onerror = () => {
          setError('Failed to read file.');
          setLoading(false);
        };
        reader.readAsDataURL(file);
      } catch {
        setError('Error parsing file data.');
        setLoading(false);
      }
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
        <div className="flex justify-center mb-6">
          <Image src="/hero.webp" alt="Phantom Hero Illustration" width={160} height={160} className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform duration-700" priority />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight sm:tracking-tighter">
          Send <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Secret Messages</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-base sm:text-lg pt-2 leading-relaxed px-4 sm:px-0">
          Lock your messages with a password so only your friends can read them. <br className="hidden sm:block" />Fast, free, and 100% private.
        </p>
      </div>

      <GlassCard className="w-full max-w-2xl mt-8">
        {/* Toggle Mode */}
        <div className="flex bg-black/40 p-1.5 rounded-full mb-8 relative shadow-inner border border-white/5 mx-auto max-w-md">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-transform duration-300 ease-out shadow-lg shadow-indigo-500/25 ${mode === 'encode' ? 'translate-x-0' : 'translate-x-[calc(100%+12px)]'
              }`}
          />
          <button
            onClick={() => { setMode('encode'); setOutput(''); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full z-10 font-semibold transition-colors ${mode === 'encode' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
          >
            <Lock className="w-4 h-4" /> Lock Message
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full z-10 font-semibold transition-colors ${mode === 'decode' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
          >
            <Unlock className="w-4 h-4" /> Unlock Message
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-indigo-200 ml-1 block">
              {mode === 'encode' ? 'Your Message or File (Drag & Drop)' : 'Scrambled Secret Code'}
            </label>
            <textarea
              value={text.startsWith('[STEGO_CARRIER]') ? "Image loaded. Ready to embed hidden data." : text}
              onChange={handleTextChange}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              placeholder={mode === 'encode' ? "Type a message OR drop a secure file/image here..." : "Paste the locked message code or drop an image here..."}
              className={`w-full h-36 ${isDragging ? 'bg-indigo-500/10 border-indigo-400 scale-[1.02]' : 'bg-white/[0.02] border-white/10'} border-2 border-dashed sm:border-solid sm:border rounded-2xl p-5 text-base sm:text-lg ${text.startsWith('[STEGO_CARRIER]') ? 'text-indigo-400 font-bold' : 'text-white'} placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] resize-none transition-all leading-relaxed`}
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-6">
                <div className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  Drop into Vault
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-200 ml-1 block">Secret Key (Password)</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter a strong password..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-base sm:text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all font-mono tracking-wider"
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

          {/* Error & Success Messages */}
          {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-lg">{error}</div>}
          {success && <div className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 p-3 rounded-lg">{success}</div>}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProcess}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 text-lg transition-colors disabled:opacity-50 disabled:pointer-events-none group shadow-xl shadow-indigo-500/25"
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
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="p-5 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center justify-center shadow-inner sm:w-16"
              title="Clear all"
            >
              <Trash2 className="w-6 h-6" />
              <span className="ml-2 sm:hidden font-semibold">Clear</span>
            </motion.button>
          </div>
        </div>
      </GlassCard>

      {/* Output Section */}
      <AnimatePresence mode="popLayout">
        {output && (
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
                <div className="flex flex-wrap gap-2 relative z-10">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                    title="Show QR Code"
                  >
                    <QrCode className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden lg:inline">QR</span>
                  </button>
                  <button
                    onClick={downloadTxtFile}
                    className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                    title="Download TXT"
                  >
                    <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden lg:inline">TXT</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-medium text-white transition-colors bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 px-3 py-1.5 rounded-md shadow-lg"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden lg:inline">Copy</span>
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
                <p className="font-mono text-xs sm:text-sm md:text-base text-gray-300 break-all select-all leading-relaxed max-h-60 overflow-y-auto w-full custom-scrollbar">
                  {output}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </motion.div>
  );
}
