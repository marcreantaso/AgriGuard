/**
 * Web Worker for image processing
 * Offloads heavy computations to separate thread
 */

// Worker code as string (will be converted to blob)
const workerCode = `
/**
 * Image Processing Worker
 * Handles computationally expensive image operations
 */

self.onmessage = async (event) => {
    const { type, data, id } = event.data;

    try {
        let result;

        switch (type) {
            case 'extractFeatures':
                result = extractFeatures(data);
                break;
            case 'normalizeImage':
                result = normalizeImage(data);
                break;
            case 'detectEdges':
                result = detectEdges(data);
                break;
            default:
                throw new Error('Unknown operation: ' + type);
        }

        self.postMessage({ id, result, error: null });
    } catch (error) {
        self.postMessage({ id, result: null, error: error.message });
    }
};

/**
 * Extract image features (edges, colors, etc.)
 */
function extractFeatures(imageData) {
    const data = imageData.data;
    const length = data.length;
    
    const features = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        edgePixels: 0
    };

    // Calculate brightness
    for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        features.brightness += (r + g + b) / 3;
    }
    features.brightness /= (length / 4);

    return features;
}

/**
 * Normalize image pixel values
 */
function normalizeImage(imageData) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1);        // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
        // Keep alpha unchanged
    }

    return imageData;
}

/**
 * Simple edge detection using Sobel operator
 */
function detectEdges(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    const output = new Uint8ClampedArray(data.length);
    
    // Simplified Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // Sample neighboring pixels
            const top = data[((y - 1) * width + x) * 4];
            const bottom = data[((y + 1) * width + x) * 4];
            const left = data[(y * width + (x - 1)) * 4];
            const right = data[(y * width + (x + 1)) * 4];
            
            // Calculate gradient
            const gx = (right - left) / 2;
            const gy = (bottom - top) / 2;
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            
            output[idx] = magnitude > 50 ? 255 : 0;
            output[idx + 1] = magnitude > 50 ? 255 : 0;
            output[idx + 2] = magnitude > 50 ? 255 : 0;
            output[idx + 3] = 255;
        }
    }
    
    return output;
}
`;

// Create worker blob
const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(workerBlob);

/**
 * Image Processing Worker Manager
 */
class ImageWorkerPool {
    constructor(poolSize = 2) {
        this.poolSize = poolSize;
        this.workers = [];
        this.taskQueue = [];
        this.activeWorkers = new Set();

        // Initialize worker pool
        for (let i = 0; i < poolSize; i++) {
            this.workers.push(new Worker(workerUrl));
        }
    }

    /**
     * Get available worker
     */
    getAvailableWorker() {
        for (const worker of this.workers) {
            if (!this.activeWorkers.has(worker)) {
                return worker;
            }
        }
        return null;
    }

    /**
     * Process image with worker
     */
    process(type, data) {
        return new Promise((resolve, reject) => {
            const worker = this.getAvailableWorker();

            if (!worker) {
                reject(new Error('No available workers'));
                return;
            }

            const id = Math.random().toString(36);
            const messageHandler = (event) => {
                if (event.data.id === id) {
                    worker.removeEventListener('message', messageHandler);
                    this.activeWorkers.delete(worker);

                    if (event.data.error) {
                        reject(new Error(event.data.error));
                    } else {
                        resolve(event.data.result);
                    }
                }
            };

            this.activeWorkers.add(worker);
            worker.addEventListener('message', messageHandler);
            worker.postMessage({ type, data, id });
        });
    }

    /**
     * Extract features
     */
    extractFeatures(imageData) {
        return this.process('extractFeatures', imageData);
    }

    /**
     * Normalize image
     */
    normalizeImage(imageData) {
        return this.process('normalizeImage', imageData);
    }

    /**
     * Detect edges
     */
    detectEdges(imageData) {
        return this.process('detectEdges', imageData);
    }

    /**
     * Terminate all workers
     */
    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        this.activeWorkers.clear();
    }
}

// Create singleton instance
export const imageWorkerPool = new ImageWorkerPool();

export { ImageWorkerPool };
