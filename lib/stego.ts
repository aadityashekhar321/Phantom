/**
 * Phantom Steganography Engine v3
 *
 * Provides two complementary modes:
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MODE A: LSB (Invisible / File-based)
 *  • Hides data in RGB LSBs. Output is always PNG.
 *  • Invisible to the human eye.
 *  • ⚠ FAILS if the image is converted to JPEG (WhatsApp/Telegram "photo" mode).
 *  • Safe when shared as a document / file (not as a media preview).
 *
 * MODE B: QR Overlay (Compression-Resistant / Share Anywhere)
 *  • Encodes the ciphertext into a visible QR code and stamps it onto the image.
 *  • QR codes have built-in Reed-Solomon error correction — survive JPEG compression.
 *  • Scannable by Phantom's built-in QR scanner AND by any phone camera.
 *  • Recommended for WhatsApp / Telegram / Instagram / Twitter sharing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Shared constants ────────────────────────────────────────────────────────
const MAGIC_HEADER = new Uint8Array([0x50, 0x48, 0x41, 0x4E, 0x54, 0x4F, 0x4D, 0x01]); // "PHANTOM\x01"
const END_MARKER = '\x00\x00PHANTOM_END\x00\x00';

function textToBytes(text: string): Uint8Array { return new TextEncoder().encode(text + END_MARKER); }
function bytesToText(bytes: Uint8Array): string { return new TextDecoder().decode(bytes); }

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// ─── Mode A: LSB Steganography (invisible, PNG-only) ─────────────────────────

/**
 * Hides `text` in the RGB LSBs of `imageSrc`.
 * Always outputs PNG. Will break if WhatsApp/Telegram converts to JPEG.
 */
export async function hideTextInImage(text: string, imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return reject(new Error('Canvas not supported'));

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;

            // Build payload: MAGIC(8) + LEN(4) + TEXT_BYTES
            const textBytes = textToBytes(text);
            const payload = new Uint8Array(MAGIC_HEADER.length + 4 + textBytes.length);
            payload.set(MAGIC_HEADER, 0);
            const len = textBytes.length;
            payload[8] = (len >>> 24) & 0xFF;
            payload[9] = (len >>> 16) & 0xFF;
            payload[10] = (len >>> 8) & 0xFF;
            payload[11] = (len) & 0xFF;
            payload.set(textBytes, 12);

            const bits: number[] = [];
            for (let i = 0; i < payload.length; i++) {
                for (let b = 7; b >= 0; b--) bits.push((payload[i] >> b) & 1);
            }

            const maxBits = Math.floor((pixels.length / 4) * 3);
            if (bits.length > maxBits) {
                return reject(new Error(`Image too small. Need ${Math.ceil(bits.length / 3)} pixels, have ${pixels.length / 4}.`));
            }

            let bitIdx = 0;
            for (let i = 0; i < pixels.length && bitIdx < bits.length; i++) {
                if ((i % 4) === 3) continue; // skip alpha
                pixels[i] = (pixels[i] & 0xFE) | bits[bitIdx++];
            }

            ctx.putImageData(imgData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load image for steganography.'));
        img.src = imageSrc;
    });
}

/**
 * Extracts LSB-hidden text from a PNG produced by hideTextInImage().
 */
export async function extractTextFromImage(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return reject(new Error('Canvas not supported'));

            ctx.drawImage(img, 0, 0);
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const bits: number[] = [];
            for (let i = 0; i < pixels.length; i++) {
                if ((i % 4) === 3) continue;
                bits.push(pixels[i] & 1);
            }

            function bitsToBytes(bitArr: number[], offset: number, count: number): Uint8Array {
                const out = new Uint8Array(count);
                for (let i = 0; i < count; i++) {
                    let byte = 0;
                    for (let b = 0; b < 8; b++) byte = (byte << 1) | (bitArr[offset + i * 8 + b] ?? 0);
                    out[i] = byte;
                }
                return out;
            }

            const headerBytes = bitsToBytes(bits, 0, MAGIC_HEADER.length);
            if (!MAGIC_HEADER.every((b, i) => headerBytes[i] === b)) {
                return reject(new Error('No Phantom LSB payload found. The image may have been compressed or was not created by Phantom.'));
            }

            const lenBytes = bitsToBytes(bits, MAGIC_HEADER.length * 8, 4);
            const payloadLen = (lenBytes[0] << 24) | (lenBytes[1] << 16) | (lenBytes[2] << 8) | lenBytes[3];

            if (payloadLen <= 0 || payloadLen > (bits.length / 8) - 12) {
                return reject(new Error('Invalid or corrupted Phantom payload.'));
            }

            const payloadBytes = bitsToBytes(bits, (MAGIC_HEADER.length + 4) * 8, payloadLen);
            const decoded = bytesToText(payloadBytes);
            const endIdx = decoded.indexOf('\x00\x00PHANTOM_END\x00\x00');
            if (endIdx === -1) {
                return reject(new Error('Payload end marker missing. Image may have been compressed.'));
            }
            resolve(decoded.slice(0, endIdx));
        };
        img.onerror = () => reject(new Error('Failed to load image to extract data.'));
        img.src = imageSrc;
    });
}

// ─── Mode B: QR Overlay (compression-resistant) ───────────────────────────────

/**
 * Composites a QR code of `ciphertext` onto `imageSrc`.
 * The QR is placed in the bottom-right corner with a white background.
 * Survives JPEG compression because QR modules are many pixels wide.
 * Output is PNG; share as photo or file — both work.
 */
export async function hideTextInImageQR(
    ciphertext: string,
    imageSrc: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        // Validate message length — QR Version 40 maxes out at ~2953 bytes content
        // Our ciphertext is already base64, so check character count
        if (ciphertext.length > 2800) {
            return reject(new Error(
                `Message too long for QR embedding (${ciphertext.length} chars). Max is ~2800. ` +
                'Try a shorter message or use Full Encryption mode.'
            ));
        }

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const W = img.width;
            const H = img.height;

            // We need at least a reasonable image size to host the QR
            const minDim = Math.min(W, H);
            if (minDim < 100) {
                return reject(new Error('Image too small for QR embedding. Use an image at least 100×100px.'));
            }

            // QR size = 30% of shorter dimension, min 120px, max 400px
            const qrPx = Math.min(400, Math.max(120, Math.floor(minDim * 0.30)));

            // ── Step 1: Generate QR bitmap using canvas + a tiny QR encoder ──
            generateQRBitmap(ciphertext, qrPx).then(qrCanvas => {
                // ── Step 2: Draw carrier image ────────────────────────────────
                const canvas = document.createElement('canvas');
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas not supported'));

                ctx.drawImage(img, 0, 0);

                // ── Step 3: Composite QR into bottom-right corner ─────────────
                const margin = 12;
                const padding = 10;              // white padding around QR
                const totalQr = qrPx + padding * 2;
                const x = W - totalQr - margin;
                const y = H - totalQr - margin;

                // White background box
                ctx.fillStyle = '#FFFFFF';
                roundRect(ctx, x - 4, y - 4, totalQr + 8, totalQr + 26, 8);
                ctx.fill();

                // Draw QR canvas
                ctx.drawImage(qrCanvas, x + padding, y + padding, qrPx, qrPx);

                // "PHANTOM" label below QR
                ctx.fillStyle = '#000000';
                ctx.font = `bold ${Math.max(8, Math.floor(qrPx * 0.065))}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText('PHANTOM', x + padding + qrPx / 2, y + padding + qrPx + 14);

                resolve(canvas.toDataURL('image/png'));
            }).catch(reject);
        };
        img.onerror = () => reject(new Error('Failed to load image for QR embedding.'));
        img.src = imageSrc;
    });
}

// ─── Pure-canvas QR Code Generator ───────────────────────────────────────────
// Uses the qrcode npm package (installed) to generate a QR code on a canvas.
// ECL 'H' = High error correction (30% data recovery) — best for JPEG resistance.

async function generateQRBitmap(text: string, sizePx: number): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        import('qrcode').then(QRCode => {
            const canvas = document.createElement('canvas');
            // qrcode.toCanvas is callback-based: toCanvas(canvas, text, options, callback)
            QRCode.toCanvas(canvas, text, {
                width: sizePx,
                margin: 1,
                errorCorrectionLevel: 'H', // High: 30% recovery — survives JPEG artefacts
                color: { dark: '#000000', light: '#FFFFFF' },
            }, (err: Error | null | undefined) => {
                if (err) {
                    reject(new Error(`QR generation failed: ${err.message}`));
                } else {
                    resolve(canvas);
                }
            });
        }).catch(() => {
            reject(new Error('QR library unavailable. Run: npm install qrcode @types/qrcode'));
        });
    });
}
