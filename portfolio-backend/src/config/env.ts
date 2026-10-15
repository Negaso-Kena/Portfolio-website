import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("https://negaso-kena.netlify.app"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be set to a long random string"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Resend
  RESEND_API_KEY: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default(""), // e.g. "Negaso Kena <noreply@caloupelio.resend.app>"
  CONTACT_RECEIVER_EMAIL: z.string().optional().default(""),

  // Keep old SMTP vars optional so existing .env files don't crash
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.string().optional().default("587"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),


  // Cloudinary file storage
CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
CLOUDINARY_API_KEY: z.string().optional().default(""),
CLOUDINARY_API_SECRET: z.string().optional().default(""),
  MAX_UPLOAD_MB: z.string().default("5"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;