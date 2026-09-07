/**
 * Lazy TensorFlow Model Loader
 * Loads the ML model only when needed to reduce initial bundle
 */

let modelInstance = null;
let modelLoading = null;

/**
 * Load TensorFlow model asynchronously
 * Caches model after first load
 */
export const loadModel = async () => {
    if (modelInstance) {
        return modelInstance;
    }

    if (modelLoading) {
        return modelLoading;
    }

    modelLoading = (async () => {
        try {
            // Import TensorFlow dynamically
            const tf = await import('@tensorflow/tfjs');
            
            console.log('📦 Loading AI model...');
            const startTime = performance.now();

            // Load model from public directory
            const MODEL_PATH = '/models/agri-guard-v1/model.json';
            modelInstance = await tf.loadLayersModel(MODEL_PATH);

            const loadTime = (performance.now() - startTime).toFixed(2);
            console.log(`✅ Model loaded in ${loadTime}ms`);

            // Warm up model with dummy prediction
            try {
                const dummyInput = tf.zeros([1, 224, 224, 3]);
                await modelInstance.predict(dummyInput);
                dummyInput.dispose();
                console.log('🔥 Model warmed up');
            } catch (error) {
                console.warn('Could not warm up model:', error);
            }

            return modelInstance;
        } catch (error) {
            console.error('Failed to load model:', error);
            modelLoading = null;
            throw error;
        }
    })();

    return modelLoading;
};

/**
 * Get cached model instance
 */
export const getModel = () => {
    if (!modelInstance) {
        throw new Error('Model not loaded. Call loadModel() first');
    }
    return modelInstance;
};

/**
 * Unload model to free memory
 */
export const unloadModel = () => {
    if (modelInstance) {
        modelInstance.dispose();
        modelInstance = null;
        console.log('🧹 Model disposed from memory');
    }
};

/**
 * Check if model is loaded
 */
export const isModelLoaded = () => {
    return modelInstance !== null;
};

/**
 * Predict disease with loaded model
 */
export const predict = async (imageData) => {
    try {
        const model = await loadModel();
        
        // Preprocess image
        let input = imageData;
        const tf = await import('@tensorflow/tfjs');
        if (imageData instanceof HTMLImageElement || imageData instanceof HTMLCanvasElement) {
            input = await tf.browser.fromPixels(imageData);
        }

        // Normalize
        input = input.div(255.0);

        // Predict
        const prediction = model.predict(tf.expandDims(input, 0));
        const result = await prediction.data();

        // Cleanup
        input.dispose();
        prediction.dispose();

        return Array.from(result);
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
};

/**
 * Get model memory usage
 */
export const getModelMemoryUsage = () => {
    if (typeof window === 'undefined') return null;

    // This requires TensorFlow.js memory API
    try {
        const tf = require('@tensorflow/tfjs');
        if (tf.memory) {
            const memory = tf.memory();
            return {
                numTensors: memory.numTensors,
                numDataBuffers: memory.numDataBuffers,
                unreliable: memory.unreliable,
                numBytes: (memory.numBytes / 1024 / 1024).toFixed(2) + ' MB'
            };
        }
    } catch (error) {
        console.debug('Memory API not available');
    }

    return null;
};
