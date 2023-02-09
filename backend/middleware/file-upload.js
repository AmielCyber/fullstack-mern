import { v4 as uuidv4 } from "uuid";
import multer from "multer";

// MIME type multer found in our file
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// G
function toDestination(req, file, cb) {
  // Null if it succeeded.
  cb(null, "uploads/images");
}

function validateImageFile(req, file, cb) {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  const error = isValid ? null : new Error("Invalid mime type!");
  // error: is null if succeeded, isValid: is true then we forward it and accept the file.
  cb(error, isValid);
}

function setFileName(req, file, cb) {
  // Get the extension we want to use.
  const ext = MIME_TYPE_MAP[file.mimetype];
  cb(null, uuidv4() + "." + ext); // Add filename
}

// Middleware for uploading files
const fileUpload = multer({
  limits: 500000, // Limit to 500k bytes
  storage: multer.diskStorage({
    destination: toDestination,
    filename: setFileName,
  }), // set file destination and filename.
  fileFilter: validateImageFile,
});

export default fileUpload;
