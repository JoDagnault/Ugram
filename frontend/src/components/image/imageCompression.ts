import imageCompression from 'browser-image-compression';
import { config } from '../../config';

export const MAX_IMAGE_SIZE_BYTES = config.uploads.MAX_IMAGE_SIZE_BYTES;
const MAX_IMAGE_DIMENSION_PX = 2000;
const JPEG_QUALITY = 0.82;
const MAX_IMAGE_SIZE_MB = MAX_IMAGE_SIZE_BYTES / (1024 * 1024);
const IMAGE_TOO_LARGE_ERROR = 'Image is too large';

export const prepareImageForUpload = async (
    file: File,
    filterCss?: string,
): Promise<File> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('Selected file must be an image');
    }

    const compressed = (await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        maxWidthOrHeight: MAX_IMAGE_DIMENSION_PX,
        initialQuality: JPEG_QUALITY,
        fileType: 'image/jpeg',
        useWebWorker: false,
    })) as File | Blob;

    const compressedFile =
        compressed instanceof File
            ? compressed
            : new File([compressed], file.name, { type: 'image/jpeg' });

    if (!filterCss || filterCss === 'none') {
        if (compressedFile.size > MAX_IMAGE_SIZE_BYTES) {
            throw new Error(IMAGE_TOO_LARGE_ERROR);
        }
        return compressedFile;
    }

    const img = await new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = URL.createObjectURL(compressedFile);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.filter = filterCss;
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );

    if (!blob) throw new Error('Failed to process image');

    const filteredFile = new File([blob], file.name, { type: 'image/jpeg' });

    if (filteredFile.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error(IMAGE_TOO_LARGE_ERROR);
    }

    return filteredFile;
};
