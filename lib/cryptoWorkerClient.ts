export const processCryptoAsync = (
    type: 'encode' | 'decode',
    text: string,
    password: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Generate a unique ID for this job
        const id = Math.random().toString(36).substring(7);

        // Initialize worker
        const worker = new Worker(new URL('./crypto.worker.ts', import.meta.url), {
            type: 'module',
        });

        // Setup listener
        worker.onmessage = (e: MessageEvent) => {
            if (e.data.id === id) {
                worker.terminate(); // Clean up memory
                if (e.data.success) {
                    resolve(e.data.result);
                } else {
                    reject(new Error(e.data.error));
                }
            }
        };

        // Handle generic worker errors
        worker.onerror = (err) => {
            worker.terminate();
            reject(new Error(err.message || 'Worker initialization failed.'));
        };

        // Send payload
        worker.postMessage({ id, type, text, password });
    });
};
