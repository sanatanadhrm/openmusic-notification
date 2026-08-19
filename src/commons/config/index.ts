// src/Commons/config/index.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    HOST: z.string().default("0.0.0.0"),
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),

    ACCESS_TOKEN_KEY: z.string().min(1, "ACCESS_TOKEN_KEY wajib diisi"),
    REFRESH_TOKEN_KEY: z.string().min(1, "REFRESH_TOKEN_KEY wajib diisi"),
    ACCESS_TOKEN_AGE: z.coerce.number().default(3000),

    RABBITMQ_SERVER: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Konfigurasi environment tidak valid:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

// Ini yang diimpor di seluruh aplikasi — sudah tervalidasi & type-safe
export const config = {
    app: {
        env: parsed.data.NODE_ENV,
        host: parsed.data.HOST,
        port: parsed.data.PORT,
    },
    database: {
        url: parsed.data.DATABASE_URL,
    },
    token: {
        accessTokenKey: parsed.data.ACCESS_TOKEN_KEY,
        refreshTokenKey: parsed.data.REFRESH_TOKEN_KEY,
        accessTokenAge: parsed.data.ACCESS_TOKEN_AGE,
    },
    rabbitmq: {
        server: parsed.data.RABBITMQ_SERVER,
    },


} as const;