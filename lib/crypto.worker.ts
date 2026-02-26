import { encryptMessage, decryptMessage } from './crypto';

self.onmessage = async (e: MessageEvent) => {
    const { id, type, text, password } = e.data;

    try {
        let result;
        if (type === 'encode') {
            result = await encryptMessage(text, password);
        } else if (type === 'decode') {
            result = await decryptMessage(text, password);
        } else {
            throw new Error(`Unknown operation type: ${type}`);
        }

        self.postMessage({ id, success: true, result });
    } catch (error) {
        self.postMessage({ id, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
};
