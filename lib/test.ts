import { encryptMessage, decryptMessage } from './crypto';

async function runTests() {
    console.log("Starting Phantom Crypto Tests...");
    let passed = 0;
    let failed = 0;

    const runTest = async (name: string, plain: string, pass: string) => {
        try {
            const encrypted = await encryptMessage(plain, pass);
            const decrypted = await decryptMessage(encrypted, pass);
            if (decrypted === plain) {
                console.log(`✅ [PASS] ${name}`);
                passed++;
            } else {
                console.error(`❌ [FAIL] ${name} | Expected: ${plain} | Got: ${decrypted}`);
                failed++;
            }
        } catch (e) {
            console.error(`❌ [ERROR] ${name} | Exception: ${e instanceof Error ? e.message : String(e)}`);
            failed++;
        }
    };

    await runTest("Simple Short Text", "Hello World!", "password123");
    await runTest("Long Text", "A".repeat(10000), "securePass99");
    await runTest("Special Characters", "!@#$%^&*()_+{}|:\"<>?~`-=[]\\;',./", "complexKey");
    await runTest("Numbers Only", "1234567890", "123");
    await runTest("Non-ASCII Characters", "Привет, мир! 你好世界！こんにちは！", "international");
    await runTest("Emojis", "😀🚀🔥👍", "emojiPass");

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
}

runTests();
