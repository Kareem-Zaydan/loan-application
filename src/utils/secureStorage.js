const ENCRYPTION_SECRET = 'lendswift-demo-client-side-secret';

function getCrypto() {
    return window.crypto || window.msCrypto;
}

function encodeText(value) {
    return new TextEncoder().encode(value);
}

function decodeText(value) {
    return new TextDecoder().decode(value);
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
}

async function getEncryptionKey() {
    const crypto = getCrypto();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encodeText(ENCRYPTION_SECRET),
        'PBKDF2',
        false,
        ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encodeText('lendswift-demo-salt'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt', 'decrypt'],
    );
}

export async function encryptJson(data) {
    const crypto = getCrypto();
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encodeText(JSON.stringify(data));

    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        encodedData,
    );

    return {
        iv: arrayBufferToBase64(iv),
        payload: arrayBufferToBase64(encryptedBuffer),
    };
}

export async function decryptJson(encryptedData) {
    const crypto = getCrypto();
    const key = await getEncryptionKey();

    const iv = new Uint8Array(base64ToArrayBuffer(encryptedData.iv));
    const encryptedBuffer = base64ToArrayBuffer(encryptedData.payload);

    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        encryptedBuffer,
    );

    return JSON.parse(decodeText(decryptedBuffer));
}

export async function saveEncryptedItem(storageKey, data) {
    const encryptedData = await encryptJson(data);

    window.localStorage.setItem(storageKey, JSON.stringify(encryptedData));
}

export async function readEncryptedItem(storageKey) {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
        return null;
    }

    const encryptedData = JSON.parse(rawValue);

    return decryptJson(encryptedData);
}

export function removeEncryptedItem(storageKey) {
    window.localStorage.removeItem(storageKey);
}

export function hasEncryptedItem(storageKey) {
    return Boolean(window.localStorage.getItem(storageKey));
}