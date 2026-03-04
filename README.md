<div align="center">

<img src="public/logo.png" alt="Phantom Logo" width="140" />

# Phantom

### Military-Grade Encryption. Zero Servers. Zero Trace.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4?logo=framer)](https://www.framer.com/motion/)
[![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5a0ef7?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy_on-Vercel-black?logo=vercel)](https://vercel.com)

**Phantom** is a fully client-side, zero-knowledge encryption vault. Lock messages and files with AES-256-GCM. Hide data inside images using steganography. Share securely via QR codes, vault files, or encrypted links — all without a single byte ever touching a server.

[**Live Demo →**](https://phantom-aadityashekhar321.vercel.app)&nbsp;&nbsp;|&nbsp;&nbsp;[**Architecture & Trust →**](https://phantom-aadityashekhar321.vercel.app/security)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **AES-256-GCM Encryption** | Military-grade authenticated encryption. Every payload gets a randomly generated IV and Salt. |
| 🔑 **PBKDF2 Key Derivation** | 100,000 iterations with SHA-256 — resistant to parallelized GPU brute-force attacks. |
| 🕵️ **Steganography Engine** | Mathematically weave encrypted text into image pixel data (LSB). The carrier image looks completely normal. |
| 🖼️ **Full Image Encryption** | Encrypt an entire image file into impenetrable ciphertext. Restore it perfectly with the correct key. |
| 📱 **PWA — Works Offline** | Installable Progressive Web App. Download once, use forever with no internet connection required. |
| 📷 **Live QR Code Scanner** | Use your camera to scan a Phantom QR code and instantly load the encrypted payload. |
| 🔗 **Secure Link Sharing** | Generate a shareable URL that embeds the encrypted payload directly in the hash fragment — with optional expiry. |
| 🗄️ **`.phantom` Vault Files** | Export encrypted payloads as self-contained `.phantom` files. Drag and drop to restore. |
| 🗂️ **Batch File Encryption** | Upload multiple files at once and bundle them into a single encrypted `.phantom` archive. |
| 💣 **Panic Wipe** | One click instantly clears all inputs, outputs, passwords, and staged data from memory. |
| ⏱️ **Self-Destruct Timer** | Automatically wipe decrypted output after 30 or 60 seconds. Setting persists across page reloads. |
| 🎭 **Deniable (Decoy) Vault** | Embed a convincing decoy message alongside your real secret, each unlocked by a different password. |
| 📝 **Secure Notes** | In-memory encrypted notepad — notes are individually password-locked and cleared when the tab closes. |
| 🌐 **Multi-Language (i18n)** | Full English and Hindi UI support with seamless, real-time language switching across all pages. |
| 🆔 **QR Identity Cards** | Generate a scannable encrypted identity card from your ciphertext, ready to print or share. |
| 🌐 **Zero-Knowledge** | No backend. No database. No telemetry. Cryptographic operations happen exclusively in the browser. |
| 🎨 **Glassmorphism UI** | Premium dark glassmorphism interface with Framer Motion micro-animations and responsive design. |
| ♿ **Accessible** | Full keyboard navigation, `aria-label` attributes, `Ctrl+Enter` shortcut, and screen-reader support. |

---

## 🔒 Security Model

Phantom is designed to be **fundamentally trustless** — it doesn't ask you to trust us because it architecturally cannot betray you.

```
Your Password  ──▶  PBKDF2 (SHA-256, 100k iter, 16-byte salt)  ──▶  256-bit Key
                                                                          │
Your Message   ──────────────────────────────────────────────────────▶  AES-256-GCM
                                                                          │
                                                                     Ciphertext + IV + Salt
                                                                     (Base64 encoded)
```

### Core Guarantees

1. **You Hold The Key** — Passwords are never transmitted, stored, or logged. Lose your key, lose the data — by design.
2. **Authenticated Encryption** — GCM mode provides both confidentiality and data integrity. Tampered ciphertext will always fail to decrypt.
3. **Perfect Forward Secrecy per Message** — A fresh random IV and Salt are generated for every single encryption operation.
4. **Zero Network Requests** — Once the page loads, Phantom makes no outbound HTTP requests of any kind.
5. **Minimal, Purpose-Bound `localStorage`** — Only non-sensitive UI preferences (Self-Destruct timer toggle and duration) are persisted. All message content, passwords, and cryptographic material exist only in active JavaScript memory and are cleared on tab close or Panic Wipe.

---

## 🧠 How It Works

### Text & File Encryption
1. Type or paste your secret message into the Vault.
2. Enter a strong password as your Secret Key.
3. Hit **Lock Now** (or press `Ctrl+Enter`). Phantom derives a 256-bit key using PBKDF2 and encrypts your message with AES-256-GCM.
4. Copy the ciphertext, export it as a `.phantom` file, generate a QR code, or share via a secure URL hash link.

### Steganography Mode
1. Drop an **image** (PNG or JPG) into the Vault.
2. Choose **Steganography** mode → select **Invisible (LSB)** or **QR Overlay**.
3. Type the secret payload and enter your password.
4. Phantom encrypts the payload, then weaves the ciphertext byte-by-byte into the **least-significant bits (LSBs)** of the image's pixel data.
5. The resulting image is downloaded and is **visually identical** to the original — but contains your hidden secret.
6. To recover: drag the carrier image back into Phantom and enter the password.

> **LSB vs QR Overlay:** LSB mode is invisible but fragile to re-compression (e.g., WhatsApp photo mode). QR Overlay embeds a visible QR code directly into the image and survives WhatsApp/Telegram photo compression.

### Full Image Encryption
1. Drop an image into the Vault.
2. Choose **Full Encryption** mode.
3. Phantom reads the raw binary of the image, converts it to Base64, then encrypts the entire thing with AES-256-GCM.
4. The output is a ciphertext `.phantom` vault file containing the encrypted image binary.

### Deniable (Decoy) Vault
Enable **Deniable Vault** mode to encode two layered messages into a single ciphertext:
- **Main password** → reveals your real secret.
- **Decoy password** → reveals a convincing but harmless fake message.

This provides plausible deniability under compulsion.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, React 18) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + Custom Glassmorphism |
| **Animations** | Framer Motion 11 |
| **Cryptography** | Web Crypto API (`AES-GCM`, `PBKDF2`, `SHA-256`) |
| **Image Processing** | HTML5 Canvas API |
| **Steganography** | Custom LSB engine (`lib/stego.ts`) |
| **QR Codes** | `qrcode.react` + `jsQR` (camera scanning) |
| **Fonts** | Google Fonts — Outfit + JetBrains Mono |
| **Icons** | Lucide React |
| **PWA** | Custom Service Worker + Web App Manifest |
| **Toasts** | Sonner |
| **i18n** | Custom `LanguageProvider` context with JSON locale files |
| **Deployment** | Vercel (free Hobby tier) |

---

## 📦 Setup & Installation

> **Requirements:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/aadityashekhar321/Phantom.git
cd Phantom

# 2. Install dependencies
npm install

# 3. Start the development server (hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build   # Creates an optimized production build
npm run start   # Serves the production build locally
```

---

## 🚀 Deployment

Phantom is a **static-capable application** that requires zero paid infrastructure.

### Deploy to Vercel (Recommended)

1. Fork or push this repo to your GitHub account.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your `Phantom` repository.
4. Vercel auto-detects Next.js. **No environment variables needed.**
5. Click **Deploy**. Done. Your free, serverless Phantom instance is live.

### Self-Hosting

Since Phantom makes no network requests after load, you can host it on any static file server or CDN by running `npm run build` and serving the `.next/` output.

---

## 📁 Project Structure

```
Phantom/
├── app/
│   ├── page.tsx                # Home — The Vault (Encode/Decode UI)
│   ├── notes/page.tsx          # Secure encrypted notepad
│   ├── security/page.tsx       # Architecture & Trust page
│   ├── how-it-works/page.tsx   # Step-by-step explainer
│   ├── changelog/page.tsx      # Full release history
│   ├── layout.tsx              # Root layout (Navbar, Footer, fonts)
│   └── globals.css             # Global styles and custom scrollbar
├── components/
│   ├── Navbar.tsx              # Responsive fixed navigation bar
│   ├── Footer.tsx              # Site footer with trust signals
│   ├── GlassCard.tsx           # Glassmorphism card wrapper
│   ├── MagneticButton.tsx      # Magnetic hover effect button
│   ├── SettingsProvider.tsx    # Global settings context (Self-Destruct, etc.)
│   ├── LanguageProvider.tsx    # i18n context (EN / HI)
│   ├── HistoryPanel.tsx        # Session encode/decode history drawer
│   ├── IdentityCardModal.tsx   # QR identity card generator
│   └── OfflineBadge.tsx        # PWA offline status indicator
├── lib/
│   ├── crypto.ts               # AES-256-GCM / PBKDF2 core logic
│   ├── cryptoWorkerClient.ts   # Web Worker wrapper for async crypto
│   ├── stego.ts                # LSB Steganography engine
│   └── worker.ts               # Dedicated Web Worker thread
├── locales/
│   ├── en.json                 # English translations
│   └── hi.json                 # Hindi translations
└── public/
    ├── logo.png                # App logo
    ├── hero.webp               # Hero illustration
    ├── security.webp           # Security page illustration
    ├── manifest.json           # PWA manifest
    └── sw.js                   # Service Worker (offline support)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` / `Cmd + Enter` | Trigger Lock / Unlock |

---

## 📋 Changelog Highlights

| Version | Highlights |
|---|---|
| **v2.3.0** | Persistent Self-Destruct Timer (localStorage), hero image animation, complete Hindi i18n |
| **v2.2.0** | Multi-Language Support — English & Hindi across all pages and components |
| **v2.1.0** | QR Identity Cards, Deniable Vault (Decoy Mode), Offline Badge |
| **v2.0.0** | Secure Notes, Self-Destruct Timer, Batch File Encryption |
| **v1.5.0** | PWA support, Service Worker, offline mode |
| **v1.0.0** | Initial release — AES-256 encryption, steganography, QR codes |

For the full history, see the [**Changelog page →**](https://phantom-aadityashekhar321.vercel.app/changelog)

---

## 🔮 Future Improvements

- **WebLLM Integration** — Local AI obfuscation (hide ciphertext inside a convincing fictional story) via WebGPU — zero server calls.
- **Biometric Unlock** — WebAuthn API as a second-factor authentication layer.
- **Additional Languages** — The i18n architecture is already in place; adding new locales requires only a new JSON file.
- **Drag-to-Reorder Output Actions** — Let users customise which output actions appear first.

---

## 🤝 Contributing

Phantom is open source and contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

Please keep all cryptographic logic strictly client-side and avoid adding any network calls or external API dependencies.

---

## 📄 License

MIT © [Aaditya Shekhar](https://github.com/aadityashekhar321)

---

<div align="center">
  <strong>Built for privacy. No compromises.</strong><br />
  <sub>If you're heavily targeted — run it offline. The math doesn't lie.</sub>
</div>
