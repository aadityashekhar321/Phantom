import re

path = r"c:\Users\HP\Desktop\Phantom\app\security\page.tsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_faqs = """const faqs = [
    {
        question: "Can Phantom recover my password?",
        answer: "No — by design. Phantom is a zero-knowledge stateless client. No servers, no databases, no password reset. Your Secret Key holds the only mathematical path to your data. Lose the key and the ciphertext remains permanently locked. This is not a limitation — it is the entire point."
    },
    {
        question: "Does Phantom track me or log my usage?",
        answer: "Never. Phantom uses zero analytics, zero cookies, zero IP logging, and zero telemetry. Once the static page loads, no outbound network requests are made. There is nothing to track because nothing is transmitted."
    },
    {
        question: "Are my files uploaded to a server for encryption?",
        answer: "No. Every cryptographic operation runs entirely inside your browser's RAM using the native Web Crypto API. Your data never crosses the network boundary. Not even a single byte. You can verify this by disconnecting from the internet and using Phantom — it works identically."
    },
    {
        question: "What is Deniable Vault (Decoy Mode)?",
        answer: "Deniable Vault allows you to encode a harmless fake message alongside your real secret. If you are under physical duress and forced to reveal your password, you provide the 'Decoy Password', which decrypts the fake message while keeping the main secret mathematically hidden."
    },
    {
        question: "How does the Self-Destruct Timer work offline?",
        answer: "The timer operates entirely in your browser's RAM. It simply clears the decrypted output from the UI automatically after the selected duration, preventing someone from reading it if they physically access your device later."
    },
    {
        question: "Why does my Steganography image fail to decode?",
        answer: "Platforms like WhatsApp, Twitter/X, Discord, and iMessage aggressively re-compress and re-encode images to reduce file size. This process permanently destroys the LSB pixel data where your hidden message is stored. Always share steganography carrier images as Files (not photos) via platforms that preserve binary losslessly: Signal, Telegram (with 'Send as File'), or direct email attachments."
    },
    {
        question: "How do I install Phantom as an offline app?",
        answer: "Phantom is a Progressive Web App (PWA). On iOS, open it in Safari → tap 'Share' → 'Add to Home Screen'. On Android, open it in Chrome → tap the menu → 'Add to Home Screen'. On Desktop Chrome or Edge, click the install icon in the address bar. Once installed, Phantom works 100% offline — no network connection required."
    },
    {
        question: "What is a .phantom Vault file?",
        answer: "A .phantom file is a self-contained encrypted bundle. When you lock data, you can export everything (ciphertext, IV, and salt metadata) into a single .phantom file for offline storage on a USB drive, hard disk, or secure archive. To decrypt, drag the .phantom file back into the Vault and provide the password."
    },
    {
        question: "Is Phantom open source? Can I audit the code?",
        answer: "Yes. Phantom is fully open source on GitHub. You can read every line of the cryptographic logic, verify no network calls are made, and confirm the security model for yourself. Trust shouldn't be assumed — it should be verified."
    }
];"""

content = re.sub(r'const faqs = \[\s*\{.*?\];', new_faqs, content, flags=re.DOTALL)

main_container_match = re.search(r'(<div className="flex flex-col gap-12 sm:gap-16">)(.*?)(                    </div>\s*</GlassCard>)', content, flags=re.DOTALL)
if not main_container_match:
    print("Could not find main container")
    exit(1)

pre = main_container_match.group(1)
inner_content = main_container_match.group(2)
post = main_container_match.group(3)

regex_parts = {
    'why': r'(\s*\{/\* ── Why Phantom\? Comparison ── \*/\}.*?)(?=\s*\{/\* Technical Specs \*/\})',
    'tech': r'(\s*\{/\* Technical Specs \*/\}.*?)(?=\s*\{/\* Cryptographic Pipeline — rewritten for performance \*/\})',
    'pipeline': r'(\s*\{/\* Cryptographic Pipeline — rewritten for performance \*/\}.*?)(?=\s*\{/\* Warnings \*/\})',
    'warnings': r'(\s*\{/\* Warnings \*/\}.*?)(?=\s*\{/\* Threat Model \*/\})',
    'threat': r'(\s*\{/\* Threat Model \*/\}.*?)(?=\s*\{/\* FAQ Section \*/\})',
    'faq': r'(\s*\{/\* FAQ Section \*/\}.*?)(?=\s*\{/\* ── Verified by Math ─────────────────────────────── \*/\})',
    'math': r'(\s*\{/\* ── Verified by Math ─────────────────────────────── \*/\}.*?)(?=\s*\{/\* ── Interactive Security Demo ─────────────────────── \*/\})',
    'demo': r'(\s*\{/\* ── Interactive Security Demo ─────────────────────── \*/\}.*?)(?=\s*\{/\* Merged Mission \& Use Cases \*/\})',
    'mission': r'(\s*\{/\* Merged Mission \& Use Cases \*/\}.*?$)'
}

blocks = {}
for name, pattern in regex_parts.items():
    match = re.search(pattern, inner_content, flags=re.DOTALL)
    if match:
        blocks[name] = match.group(1)
    else:
        print(f"Could not find {name}")
        exit(1)

ordered = [
    blocks['why'],
    blocks['tech'],
    blocks['pipeline'],
    blocks['demo'],
    blocks['math'],
    blocks['threat'],
    blocks['warnings'],
    blocks['faq'],
    blocks['mission']
]

new_inner = "".join(ordered)
new_content = content.replace(inner_content, new_inner)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: REORDERED")
