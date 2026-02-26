<div align="center">
  <img src="public/logo.png" alt="Phantom Logo" width="120" />
  <h1>Phantom</h1>
  <p><strong>Secure & Invisible Client-Side Communication</strong></p>
</div>

<br />

Phantom is a static, zero-knowledge, fully client-side encryption utility built for absolute privacy. It converts ordinary text into AES-256-GCM encrypted ciphertext, adds a token-scrambled semantic obfuscation layer, and allows easy sharing via Base64 strings, QR codes, or TXT file downloads. 

Crucially, **Phantom operates 100% in your browser**—there are no databases, no backends, and no telemetry.

---

## 🚀 Key Features

- **Military-Grade Security**: AES-256-GCM encryption with randomly generated IVs and Salts for every payload.
- **Robust Key Derivation**: PBKDF2 with a SHA-256 hash and 100,000 iterations to withstand parallelized GPU brute-forcing.
- **Zero-Knowledge Architecture**: The app is completely stateless. No backend API, no tracking, and no `localStorage`. The keys exist only in active RAM.
- **Advanced Steganography**: Hide your encrypted payloads entirely inside the pixel data of ordinary images without noticeably altering the visuals.
- **Full Image Encryption**: Lock an entire image file directly into impenetrable ciphertext.
- **Premium Glassmorphism UI**: A highly polished, cyberpunk-inspired responsive interface built with modern Framer Motion kinematics and Tailwind CSS.
- **Offline Capable**: Since the entire engine runs locally natively via Web Crypto APIs, Phantom can be downloaded and run completely offline in absolute parity mode.

---

## 🔒 The Security Model

Phantom was designed to be fundamentally trustless:

1. **You hold the key**: Passwords cannot be recovered because we never receive them. 
2. **Authenticated Ciphertexts**: Data is not just encrypted, it is authenticated (GCM). Any bitwise modifications made to the payload in transit will cause Phantom to reject decryption.
3. **No Network Requests**: Once the static UI loads, zero network requests are made.

---

## 🧠 How It Works

Phantom handles standard text and image payloads dynamically based on user intent.

### Standard Files & Text
If you upload an ordinary document or type a message, Phantom converts the entire payload into Base64. It is then encrypted using your Secret Key, outputting a highly secure ciphertext block that can be shared instantly.

### Dual Image Encryption Engine
If you upload an **Image** (`.PNG` or `.JPG`), Phantom provides two distinct advanced processing modes:

1. **Steganography (Hide Text in Image)**: You type a secret message. Phantom encrypts the message and mathematically weaves the ciphertext into the *least-significant bits (LSB)* of the image's pixel data. The carrier image looks identical to the human eye but hides your encrypted data inside.
2. **Full File Encryption (Lock Image)**: Phantom treats the image file itself as a raw data blob. It encrypts the entire image file into a massive string of data. The image is destroyed and rendered unreadable until the correct Secret Key reconstructs it on the other side.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS, Glassmorphism aesthetics
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Cryptography**: Native Browser Web Crypto API
- **Image Processing**: HTML5 Canvas (Client-side)
- **Deployment**: Vercel (Static HTML Export)

---

## 📦 Installation & Deployment

This project requires exactly zero paid services, container deployments, or external APIs. 

### Local Development
To run this project locally on your machine:
```bash
# 1. Clone the repository
git clone https://github.com/aadityashekhar321/Phantom.git
cd Phantom

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Free Vercel Deployment
Phantom is intentionally built as a static application, meaning it can be hosted indefinitely on Vercel's completely free *Hobby* tier.

1. Push this code to a repository on your GitHub account.
2. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your `Phantom` repository.
4. Vercel will auto-detect Next.js. **Do not** add any environment variables.
5. Click **Deploy**.

---

## 🔮 Future Improvements

Want to add real local AI models? Because Phantom is fully client-side, you can integrate [WebLLM](https://webllm.mlc.ai/) or [Transformers.js](https://huggingface.co/docs/transformers.js/index) natively in the browser via WebGPU to perform localized semantic obfuscation (e.g., instructing an AI to disguise Base64 strings as fictional stories) without ever sending data to OpenAI or Anthropic.

---

<div align="center">
  <p>Built for privacy. Execute strictly offline if heavily targeted.</p>
</div>
