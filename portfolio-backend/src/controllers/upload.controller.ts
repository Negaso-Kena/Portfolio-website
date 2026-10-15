
import { Request, Response } from "express";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Keep image optimization before uploading to reduce bandwidth and storage.
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;

const sanitizeBaseName = (originalname: string) => {
  const ext = path.extname(originalname);
  return (
    path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "-") ||
    "file"
  );
};

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured. Check the server environment variables.");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
};

// POST /api/admin/upload (admin) — expects one "file" field via multer.
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");

  configureCloudinary();

  const base = sanitizeBaseName(req.file.originalname);
  const isImage = req.file.mimetype.startsWith("image/");

  let buffer: Buffer;
  let filename: string;
  let mimetype: string;
  let resourceType: "image" | "raw";

  if (isImage) {
    buffer = await sharp(req.file.buffer)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    filename = `${base}-${Date.now()}.webp`;
    mimetype = "image/webp";
    resourceType = "image";
  } else {
    // PDFs are uploaded unchanged.
    buffer = req.file.buffer;
    filename = `${base}-${Date.now()}${path.extname(req.file.originalname) || ".pdf"}`;
    mimetype = req.file.mimetype;
    resourceType = "raw";
  }

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: resourceType === "raw"
          ? `portfolio/resumes/${filename}`
          : `portfolio/images/${path.parse(filename).name}`,
        overwrite: false,
      },
      (error, uploaded) => {
        if (error) return reject(error);
        if (!uploaded) return reject(new Error("Cloudinary returned no upload result"));
        resolve({
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      },
    );

    stream.end(buffer);
  });

  res.status(201).json({
    success: true,
    data: {
      filename,
      url: result.secure_url,
      mimetype,
      size: buffer.length,
    },
  });
});
