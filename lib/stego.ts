/**
 * Phantom Steganography Engine
 * Hides and extracts encrypted strings inside the Least Significant Bits (LSB) 
 * of the Alpha channel in PNG images using the Canvas API.
 */

const END_MARKER = '[[PHANTOM_END]]';

export async function hideTextInImage(text: string, imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas not supported'));

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // Encode text into binary
            const payload = text + END_MARKER;
            let binStr = '';
            for (let i = 0; i < payload.length; i++) {
                binStr += payload.charCodeAt(i).toString(2).padStart(8, '0');
            }

            // Hide binary string into the LSB of the alpha channels
            // (Using alpha channels prevents drastic color shifting on the actual image)
            let ptr = 0;
            for (let i = 3; i < data.length; i += 4) { // Traverse Alpha channel only
                if (ptr < binStr.length) {
                    // Clear LSB and set to our bit
                    data[i] = (data[i] & ~1) | parseInt(binStr[ptr], 10);
                    ptr++;
                } else {
                    break;
                }
            }

            if (ptr < binStr.length) {
                return reject(new Error('Image is too small to hold this much data.'));
            }

            ctx.putImageData(imgData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load image for steganography.'));
        img.src = imageSrc;
    });
}

export async function extractTextFromImage(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas not supported'));

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            let binStr = '';
            // Read LSB from Alpha channels
            for (let i = 3; i < data.length; i += 4) {
                binStr += (data[i] & 1).toString();
            }

            // Convert binary to string
            let extracted = '';
            for (let i = 0; i < binStr.length; i += 8) {
                const charCode = parseInt(binStr.slice(i, i + 8), 2);
                extracted += String.fromCharCode(charCode);
                if (extracted.endsWith(END_MARKER)) {
                    return resolve(extracted.replace(END_MARKER, ''));
                }
            }

            reject(new Error('No Phantom payload found in this image.'));
        };
        img.onerror = () => reject(new Error('Failed to load image to extract data.'));
        img.src = imageSrc;
    });
}
