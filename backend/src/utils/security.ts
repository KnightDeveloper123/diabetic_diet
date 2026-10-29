
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const keyBytes = new TextEncoder().encode(
    SECRET_KEY.padEnd(32, " ").slice(0, 32)
);

export const encrypt = (data: unknown): string => {
    const textBytes = new TextEncoder().encode(JSON.stringify(data));

    // XOR encryption
    const encryptedBytes = textBytes.map(
        (byte, i) => byte ^ keyBytes[i % keyBytes.length]
    );

    // Convert to Base64 and URL-encode
    const final = Buffer.from(encryptedBytes).toString("base64");

    return encodeURIComponent(final);
};

export const decrypt = <T = unknown>(encryptedData: string): T => {
    const decodedBase64 = decodeURIComponent(encryptedData);

    // Convert Base64 back to bytes
    const textBytes = new Uint8Array(
        Buffer.from(decodedBase64, "base64")
    );

    // XOR decryption
    const decryptedBytes = textBytes.map(
        (byte, i) => byte ^ keyBytes[i % keyBytes.length]
    );

    return JSON.parse(
        new TextDecoder().decode(decryptedBytes)
    ) as T;
};
