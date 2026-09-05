/**
 * Image Optimization Utilities
 * Optimizes images before upload/display
 */

/**
 * Compress and resize image
 */
export const optimizeImage = async (
    imageSource,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8
) => {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with quality compression
                canvas.toBlob(
                    (blob) => {
                        resolve({
                            blob,
                            dataUrl: canvas.toDataURL('image/jpeg', quality),
                            width,
                            height,
                            originalSize: img.src.length,
                            optimizedSize: blob.size,
                            compressionRatio: ((1 - blob.size / img.src.length) * 100).toFixed(2) + '%'
                        });
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));

            // Handle different image sources
            if (typeof imageSource === 'string') {
                img.src = imageSource;
            } else if (imageSource instanceof Blob) {
                img.src = URL.createObjectURL(imageSource);
            }
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Compress image file
 */
export const compressImageFile = async (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const optimized = await optimizeImage(e.target.result, maxWidth, maxWidth, quality);
                
                // Create new File from blob
                const compressedFile = new File(
                    [optimized.blob],
                    file.name,
                    { type: 'image/jpeg' }
                );

                resolve({
                    ...optimized,
                    file: compressedFile
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (imageSource) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                aspectRatio: img.width / img.height
            });
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        if (typeof imageSource === 'string') {
            img.src = imageSource;
        } else if (imageSource instanceof Blob) {
            img.src = URL.createObjectURL(imageSource);
        }
    });
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = async (imageSource, size = 200, quality = 0.7) => {
    return optimizeImage(imageSource, size, size, quality);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate image before processing
 */
export const validateImage = async (file, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
        minWidth = 100,
        minHeight = 100
    } = options;

    // Check file size
    if (file.size > maxSize) {
        throw new Error(`File size exceeds ${formatFileSize(maxSize)}`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed`);
    }

    // Check dimensions
    const dimensions = await getImageDimensions(file);
    if (dimensions.width < minWidth || dimensions.height < minHeight) {
        throw new Error(`Image must be at least ${minWidth}x${minHeight}px`);
    }

    return dimensions;
};

/**
 * Generate image srcset for responsive images
 */
export const generateSrcSet = (baseUrl, sizes = [320, 640, 1200]) => {
    return sizes
        .map(size => `${baseUrl}?w=${size} ${size}w`)
        .join(', ');
};
