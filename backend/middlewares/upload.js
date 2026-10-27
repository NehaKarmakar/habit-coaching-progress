import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer( {
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maximum 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, JPG, and PNG files are allowed"));
        }
    }
})

export default upload;