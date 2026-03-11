import imageCompression from 'browser-image-compression';

export const MAX_IMAGE_SIZE_BYTES = Number(
    import.meta.env.VITE_MAX_IMAGE_SIZE_BYTES ?? 10 * 1024 * 1024,
);
const MAX_IMAGE_DIMENSION_PX = 2000;
const JPEG_QUALITY = 0.82;
const MAX_IMAGE_SIZE_MB = MAX_IMAGE_SIZE_BYTES / (1024 * 1024);
const IMAGE_TOO_LARGE_ERROR = 'Image is too large';

export const prepareImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('Selected file must be an image');
    }

    const processedFile = await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        maxWidthOrHeight: MAX_IMAGE_DIMENSION_PX,
        initialQuality: JPEG_QUALITY,
        fileType: 'image/jpeg',
        useWebWorker: false,
    });

    if (processedFile.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error(IMAGE_TOO_LARGE_ERROR);
    }

    return processedFile;
};
