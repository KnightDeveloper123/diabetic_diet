import multer, { type StorageEngine } from "multer";
import type { Request } from "express";

interface UploadOptions {
    allowedTypes?: string[];
    maxSizeMB?: number;
    useMemoryStorage?: boolean;
    customStorage?: StorageEngine | null;
}

const createUploadMiddleware = ({
    allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "application/octet-stream"
    ],
    maxSizeMB = 5,
    useMemoryStorage = true,
    customStorage = null
}: UploadOptions = {}) => {

    const storage: StorageEngine = useMemoryStorage
        ? multer.memoryStorage()
        : customStorage || multer.diskStorage({});

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid Format!"));
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024
        }
    });
};

export default createUploadMiddleware;