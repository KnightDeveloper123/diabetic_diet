const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encrypt = (data: unknown): string => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in env variables");
  }

  const keyBytes = new TextEncoder().encode(
    SECRET_KEY.padEnd(32, " ").slice(0, 32)
  );

  const textBytes = new TextEncoder().encode(JSON.stringify(data));

  // XOR encryption
  const encryptedBytes = textBytes.map(
    (byte, i) => byte ^ keyBytes[i % keyBytes.length]
  );

  // Convert to Base64
  return btoa(String.fromCharCode(...encryptedBytes));
};

export const decrypt = <T = unknown>(encryptedData: string): T | null => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in env variables");
  }

  try {
    const keyBytes = new TextEncoder().encode(
      SECRET_KEY.padEnd(32, " ").slice(0, 32)
    );

    const textBytes = Uint8Array.from(
      atob(encryptedData),
      (char) => char.charCodeAt(0)
    );

    // XOR decryption
    const decryptedBytes = textBytes.map(
      (byte, i) => byte ^ keyBytes[i % keyBytes.length]
    );

    const decryptedText = new TextDecoder().decode(decryptedBytes);

    return JSON.parse(decryptedText) as T;
  } catch (error: unknown) {
    console.error("Decrypt Error:", error);
    return null;
  }
};