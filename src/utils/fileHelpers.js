export function formatFileSize(sizeInBytes) {
    if (!sizeInBytes) {
        return '0 KB';
    }

    const sizeInKb = sizeInBytes / 1024;

    if (sizeInKb < 1024) {
        return `${sizeInKb.toFixed(1)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(2)} MB`;
}

export function isImageFile(file) {
    return file.type.startsWith('image/');
}

export function createDocumentRecord(file, compressedFile = file) {
    return {
        id: `${file.name}-${file.size}-${Date.now()}`,
        name: compressedFile.name,
        originalName: file.name,
        type: compressedFile.type,
        size: compressedFile.size,
        originalSize: file.size,
        compressionSavedBytes: Math.max(file.size - compressedFile.size, 0),
        previewUrl: URL.createObjectURL(compressedFile),
        uploadedAt: new Date().toISOString(),
    };
}

export function revokePreviewUrl(documentRecord) {
    if (documentRecord?.previewUrl) {
        URL.revokeObjectURL(documentRecord.previewUrl);
    }
}

export async function compressImageFile(file) {
    if (!isImageFile(file)) {
        return file;
    }

    const imageBitmap = await createImageBitmap(file);

    const maxWidth = 1200;
    const scale = Math.min(1, maxWidth / imageBitmap.width);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(imageBitmap.width * scale);
    canvas.height = Math.round(imageBitmap.height * scale);

    const context = canvas.getContext('2d');

    context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.78);
    });

    if (!blob) {
        return file;
    }

    return new File(
        [blob],
        file.name.replace(/\.(png|jpg|jpeg)$/i, '.jpg'),
        {
            type: 'image/jpeg',
            lastModified: Date.now(),
        },
    );
}