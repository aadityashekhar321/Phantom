import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');

async function convertToWebp() {
    try {
        const files = fs.readdirSync(publicDir);

        for (const file of files) {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
                const inputPath = path.join(publicDir, file);
                const fileNameWithoutExt = path.parse(file).name;
                // Don't convert favicon/logo files that we need specifically as png
                if (fileNameWithoutExt === 'logo') continue;

                const outputPath = path.join(publicDir, `${fileNameWithoutExt}.webp`);

                console.log(`Converting ${file} to ${fileNameWithoutExt}.webp...`);

                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`✓ Created ${fileNameWithoutExt}.webp - Optimizing size`);
            }
        }
        console.log('\nAsset optimization complete.');
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

convertToWebp();
