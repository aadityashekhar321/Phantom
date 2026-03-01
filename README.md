<div align="center">

<img src="public/logo.png" alt="Phantom Logo" width="140" />

# Phantom

### Military-Grade Encryption. Zero Servers. Zero Trace.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4?logo=framer)](https://www.framer.com/motion/)
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
| 🔗 **Secure Link Sharing** | Generate a shareable URL that embeds the encrypted payload directly in the hash fragment. |
| 🗄️ **`.phantom` Vault Files** | Export encrypted payloads as self-contained `.phantom` files. Drag and drop to restore. |
| 💣 **Panic Wipe** | One click instantly clears all inputs, outputs, passwords, and staged data from memory. |
| 🌐 **Zero-Knowledge** | No backend. No database. No telemetry. Cryptographic operations happen exclusively in the browser. |
| 🎨 **Glassmorphism UI** | Premium dark glassmorphism interface with Framer Motion micro-animations and responsive design. |
| ♿ **Accessible** | Full keyboard navigation, `aria-label` attributes, `Ctrl+Enter` shortcut, and screen-reader consideration. |

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
5. **No `localStorage`** — All state lives only in active JavaScript memory. Close the tab and it's gone.

---

## 🧠 How It Works

### Text & File Encryption
1. Type or paste your secret message into the Vault.
2. Enter a strong password as your Secret Key.
3. Hit **Lock Now** (or press `Ctrl+Enter`). Phantom derives a 256-bit key using PBKDF2 and encrypts your message with AES-256-GCM.
4. Copy the ciphertext, export it as a `.phantom` file, generate a QR code, or share via a secure URL hash link.

### Steganography Mode
1. Drop an **image** (PNG or JPG) into the Vault.
2. Choose **Steganography** mode.
3. Type the secret payload and enter your password.
4. Phantom encrypts the payload, then weaves the ciphertext byte-by-byte into the **least-significant bits (LSBs)** of the image's pixel data.
5. The resulting image is downloaded and is **visually identical** to the original — but contains your hidden secret.
6. To recover: drag the carrier image back into Phantom and enter the password.

### Full Image Encryption
1. Drop an image into the Vault.
2. Choose **Full Encryption** mode.
3. Phantom reads the raw binary of the image, converts it to Base64, then encrypts the entire thing with AES-256-GCM.
4. The output is a ciphertext `.phantom` vault file containing the encrypted image binary.

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
| **QR Codes** | `qrcode.react` + `jsQR` (camera scanning) |
| **Fonts** | Google Fonts — Outfit + JetBrains Mono |
| **Icons** | Lucide React |
| **PWA** | Custom Service Worker + Web App Manifest |
| **Toasts** | Sonner |
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

Since Phantom makes no network requests after load, you can host it on any static file server, CDN, or even locally by opening the `out/` directory after running `next export`.

---

## 📁 Project Structure

```
Phantom/
├── app/
│   ├── page.tsx              # Home — The Vault (Encode/Decode UI)
│   ├── security/page.tsx     # Architecture & Trust page
│   ├── layout.tsx            # Root layout (Navbar, Footer, fonts)
│   └── globals.css           # Global styles and custom scrollbar
├── components/
│   ├── Navbar.tsx            # Responsive navigation bar
│   ├── Footer.tsx            # Site footer with trust signals
│   ├── GlassCard.tsx         # Glassmorphism card wrapper
│   └── MagneticButton.tsx    # Magnetic hover effect button
├── lib/
│   ├── crypto.ts             # AES-256-GCM / PBKDF2 core logic
│   ├── cryptoWorkerClient.ts # Web Worker wrapper for async crypto
│   ├── stego.ts              # LSB Steganography engine
│   └── worker.ts             # Dedicated Web Worker thread
└── public/
    ├── logo.png              # App logo
    ├── hero.webp             # Hero illustration
    ├── manifest.json         # PWA manifest
    └── sw.js                 # Service Worker (offline support)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` / `Cmd + Enter` | Trigger Lock / Unlock |

---

## 🔮 Future Improvements

The following enhancements are under consideration for future versions:

- **WebLLM Integration** — Use [WebLLM](https://webllm.mlc.ai/) or [Transformers.js](https://huggingface.co/docs/transformers.js/index) running entirely via WebGPU to perform local AI-based obfuscation (e.g., hiding ciphertext inside a convincing fictional story) without any server calls.
- **Biometric Unlock** — Use the WebAuthn API as a second-factor authentication layer.
- **Password-Protected Vault Exports** — Encrypt `.phantom` files with an additional layer bound to a device-specific key.
- **History Panel** — In-memory only (cleared on tab close) list of recent encode/decode operations for the current session.
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
