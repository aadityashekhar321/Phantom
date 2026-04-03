import re

with open(r"c:\Users\HP\Desktop\Phantom\app\security\page.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace faqs
new_faqs = """const faqs = [
    { question: "Can Phantom recover my password if I forget it?", answer: "No — by design. Phantom is a zero-knowledge, stateless client. There are no servers, no databases, and no password-reset mechanism. Your Secret Key is the only mathematical path to your ciphertext. If you lose it, the data remains permanently and irreversibly locked. This is not a limitation — it is the security guarantee." },
    { question: "Does Phantom track me or log my usage?", answer: "Never. Phantom uses zero analytics, zero cookies, zero IP logging, and zero telemetry of any kind. Once the static page loads into your browser, no further outbound network requests are made. The app has no backend to send data to — there is nothing to track because nothing is transmitted." },
    { question: "Are my files or messages uploaded to a server for encryption?", answer: "No. Every cryptographic operation — key derivation, encryption, decryption — runs entirely inside your browser's RAM using the native Web Crypto API. Your plaintext never crosses the network boundary. You can verify this yourself: open Phantom, disconnect from the internet, and use it normally. It is identical." },
    { question: "What makes AES-256-GCM better than other encryption modes?", answer: "AES-256-GCM is an Authenticated Encryption with Associated Data (AEAD) cipher. Unlike AES-CBC, it simultaneously encrypts and authenticates the ciphertext using a 128-bit GCM authentication tag. This means any single-bit tampering of the ciphertext — by an attacker or file corruption — is detected mathematically before decryption even begins. You get both confidentiality and integrity in one cryptographic operation." },
    { question: "Why does Phantom use 100,000 PBKDF2 iterations?", answer: "PBKDF2 forces each password-guess attempt to repeat the same 100,000 SHA-256 hash computations. A modern GPU that could try 10¹³ raw SHA-256 guesses per second is reduced to roughly 10⁸ effective guesses per second after PBKDF2. Combined with the 2²⁵⁶ AES key space, this makes brute-force attacks computationally infeasible even against nation-state adversaries with GPU clusters." },
    { question: "Why does my Steganography image fail to decode on other platforms?", answer: "Platforms like WhatsApp, Twitter/X, Discord, and iMessage aggressively re-compress and re-encode images to reduce file sizes. This permanently destroys the LSB (Least Significant Bit) pixel data where the hidden message is stored. Always share steganography carrier images as raw Files — not photos — using platforms that preserve binary data losslessly: Signal ('Send as File'), Telegram ('Send as File'), or direct email attachments." },
    { question: "What is Deniable Vault (Decoy Mode)?", answer: "Deniable Vault allows you to encode a harmless fake message alongside your real secret. If you are under physical duress and forced to reveal your password, you provide the 'Decoy Password', which decrypts the fake message while keeping the main secret mathematically hidden." },
    { question: "How does the Self-Destruct Timer work offline?", answer: "The timer operates entirely in your browser's RAM. It simply clears the decrypted output from the UI automatically after the selected duration, preventing someone from reading it if they physically access your device later." },
    { question: "Is my encrypted data safe if Phantom's servers go down?", answer: "Yes, completely. Phantom has no servers. The application is a static client-side website. Your encrypted output is a self-contained string or .phantom file you hold locally. Even if the Phantom website ceased to exist tomorrow, the Web Crypto API used to decrypt your data is built into every modern browser — permanently and natively. You can decrypt your data with any browser, forever." },
    { question: "What is the difference between the Vault and Steganography tools?", answer: "The Vault tool encrypts plaintext or files into opaque ciphertext — the output is unreadable and obviously protected. Steganography hides a message inside an innocent-looking carrier image at the pixel level, so that no one looking at the image can tell a secret is present. For maximum security, combine both: encrypt your message in the Vault, then hide the ciphertext inside an image using Steganography. An attacker would need to detect the hidden channel and then break AES-256-GCM." },
    { question: "How do I install Phantom as an offline app?", answer: "Phantom is a Progressive Web App (PWA). On iOS: open in Safari → tap 'Share' → 'Add to Home Screen'. On Android: open in Chrome → menu → 'Add to Home Screen'. On Desktop Chrome or Edge: click the install icon in the address bar. Once installed, Phantom works 100% offline — no internet connection is ever required for cryptographic operations." },
    { question: "What is a .phantom Vault file?", answer: "A .phantom file is a self-contained encrypted bundle produced by the Vault tool. It packages the ciphertext, IV (Initialization Vector), and salt metadata into a single portable file you can store on a USB drive, encrypted hard disk, or offline archive. To decrypt, drag the .phantom file back into the Vault and provide the original password. The file format is open and inspectable." },
    { question: "Is Phantom open source? Can I audit the code?", answer: "Yes. Phantom is fully open source on GitHub. You can read every line of cryptographic logic, verify that no network requests are made, inspect the key derivation parameters, and confirm the entire security model independently. Trust should never be assumed — it should be verified. The GitHub link is at the bottom of this page." },
];"""

text = re.sub(r'const faqs = \[\s*\{.*?\];', new_faqs, text, flags=re.DOTALL)

# Reorder
import collections

blocks = collections.OrderedDict()
regex_parts = {
    '1': r'(\s*\{/\* ── 1\. Why Phantom\? ── \*/\}.*?)(?=\s*\{/\* ── 2\. )',
    '2': r'(\s*\{/\* ── 2\. Phantom Mission \+ Use Cases ── \*/\}.*?)(?=\s*\{/\* ── 3\. )',
    '3': r'(\s*\{/\* ── 3\. Technical Specifications ── \*/\}.*?)(?=\s*\{/\* ── 4\. )',
    '4': r'(\s*\{/\* ── 4\. Cryptographic Pipeline ── \*/\}.*?)(?=\s*\{/\* ── 5\. )',
    '5': r'(\s*\{/\* ── 5\. Interactive Security Demo ── \*/\}.*?)(?=\s*\{/\* ── 6\. )',
    '6': r'(\s*\{/\* ── 6\. Verified by Math ── \*/\}.*?)(?=\s*\{/\* ── 7\. )',
    '7': r'(\s*\{/\* ── 7\. Important Warnings ── \*/\}.*?)(?=\s*\{/\* ── 8\. )',
    '8': r'(\s*\{/\* ── 8\. Privacy Threat Model ── \*/\}.*?)(?=\s*\{/\* ── 9\. )',
    '9': r'(\s*\{/\* ── 9\. Zero-Knowledge FAQ ── \*/\}.*?)(?=\s*\{/\* ── 10\. )',
    '10': r'(\s*\{/\* ── 10\. GitHub CTA ── \*/\}.*?)(?=\s*</div>\s*</GlassCard>)'
}

for name, pattern in regex_parts.items():
    match = re.search(pattern, text, flags=re.DOTALL)
    if match:
        blocks[name] = match.group(1)
    else:
        print(f"Could not find {name}")
        exit(1)

def fix_num(block, old_num, new_num):
    return re.sub(rf'\{{/\* ── {old_num}\.', f'{{/* ── {new_num}.', block)

sequence = [
    fix_num(blocks['1'], 1, 1),
    fix_num(blocks['3'], 3, 2),
    fix_num(blocks['4'], 4, 3),
    fix_num(blocks['5'], 5, 4),
    fix_num(blocks['6'], 6, 5),
    fix_num(blocks['8'], 8, 6),
    fix_num(blocks['7'], 7, 7),
    fix_num(blocks['9'], 9, 8),
    fix_num(blocks['2'], 2, 9),
    fix_num(blocks['10'], 10, 10)
]

new_inner = "".join(sequence)
inner_pattern = r'(\s*\{/\* ── 1\. Why Phantom\? ── \*/\}.*?)(?=\s*</div>\s*</GlassCard>)'
text = re.sub(inner_pattern, new_inner, text, flags=re.DOTALL)

with open(r"c:\Users\HP\Desktop\Phantom\app\security\page.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS")
