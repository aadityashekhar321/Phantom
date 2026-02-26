# Phantom - Secure & Invisible Communication

Phantom is a static, zero-knowledge, and fully client-side encryption utility for secure communication. It converts ordinary text into AES-256-GCM encrypted ciphertext, adds a token-scrambled semantic obfuscation layer, and allows easy sharing via Base64 strings, QR codes, or TXT downloads.

## Features
- **AES-256-GCM Encryption**: Secure encryption with random IV and Salt.
- **PBKDF2 Key Derivation**: 100,000 iterations against brute-forcing.
- **Zero-Knowledge**: No backend, no API, no databases. Runs purely locally in the browser.
- **Obfuscation Layer**: Adds token scrambling and semantic framing to ciphertext.
- **Glassmorphism Theme**: Cyberpunk / futuristic gradient UI built with Tailwind CSS.
- **Premium Animations**: Cinematic Framer Motion physics, floating elements, and matrix typewriter reveals.
- **Mobile Responsive**: Meticulously optimized typography, padding, and layout for an app-like mobile experience.
- **Export Options**: 1-click Copy, QR Code generation, and direct TXT file downloads.

## Vercel Deployment Instructions (FREE)
This project is built using Next.js strictly as a static frontend application. It requires absolutely no paid services or external APIs. It will run indefinitely on Vercel's completely free *Hobby* tier.

### Step 1: Push to GitHub
1. Open your terminal in the `Phantom` folder.
2. Run standard git commands to initialize and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Phantom"
   ```
3. Create a new repository on your [GitHub account](https://github.com/new).
4. Run the remote command provided by GitHub (e.g. `git remote add origin https://github.com/yourusername/Phantom.git`).
5. Push your code: `git push -u origin main`.

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com/) and create a free account if you haven't already.
2. Click **Add New Project**.
3. Under **Import Git Repository**, find `Phantom` and click **Import**.
4. Vercel will automatically detect that it is a Next.js project.
5. You **do not** need to add any environment variables since there is no backend API.
6. Click **Deploy**. Vercel will build the project and assign you a free `your-project.vercel.app` domain.

### Paid Services Confirmation
**NO paid services are required.** The app strictly relies on the Web Crypto API built directly into all modern web browsers.

## Security Explanation
Phantom was designed to be trustless:
- **Key Derivation (PBKDF2):** Passwords are stretched 100,000 times before being used as a key.
- **Encryption Algorithm (AES-GCM):** Data is not only encrypted but authenticated. Any modifications to the ciphertext or obfuscation layer will cause it to be rejected.
- **Stateless Execution:** State is never saved to `localStorage` or `sessionStorage`. All computation uses variables kept in active memory.

## How Image & File Encryption Works (Explained Simply)
When you upload files or images into Phantom, different things happen depending on what you upload and your goals.

### 1. The "Base64" Conversion (Standard Files)
If you upload an ordinary document (like a PDF, Word Doc, or Text File), Phantom converts the **entire file** into a massive block of text called **Base64**. It looks like random letters and numbers.
- **Encryption:** Phantom then encrypts this massive block of text using your Secret Key.
- **Extraction:** When the receiver enters the secret key, Phantom reads the locked text, decrypts it back into Base64, and then immediately converts the Base64 back into the original recognizable file so it can be downloaded.

### 2. Steganography: Hiding Secrets Inside Images
If you upload an **Image** (.PNG or .JPG), Phantom asks if you want to use it as a "Carrier". This uses an entirely different concept called **Steganography**.
- **Carrier Preparation:** The image itself is **NOT** encrypted. It remains a completely normal image that anyone can view.
- **Weaponization:** You type a secret message, which Phantom then encrypts with your password.
- **Hiding the Data:** Phantom mathematically weaves your tiny encrypted message into the completely invisible, least-significant color pixels of the image you uploaded. 
- **The Result:** The image looks identical to the human eye. If someone intercepts it, they just see a normal picture. But if someone drags that picture back into Phantom and enters the password, the hidden pixels are extracted and your secret message is revealed.

## How to Extend Later with Real AI Locally
To expand this project into utilizing real local AI models (without external APIs), you can integrate **WebLLM** or **Transformers.js**:
1. Install `transformers.js` (`npm i @xenova/transformers`).
2. Download a lightweight quantized model (e.g. `Xenova/LaMini-Flan-T5-77M` or a local ONNX embedding model).
3. Use the model completely in the browser through WebGPU to perform semantic obfuscation. For example, instruct the local AI to "rewrite the base64 code as a fictional story" and extract the base64 from it on decode. No calls to OpenAI or Anthropic required!
