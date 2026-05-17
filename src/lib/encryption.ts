import crypto from "crypto";

const SECRET = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET || "fallback-secret-for-fitdesk-development-only-32-chars";

// Deriva uma chave estável de 32 bytes (256 bits) da chave secreta
const ENCRYPTION_KEY = crypto.createHash("sha256").update(SECRET).digest();

/**
 * Criptografa uma string usando AES-256-GCM.
 * Retorna uma string no formato iv:authTag:encryptedText
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12); // GCM recomenda 12 bytes de IV
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decriptografa uma string criptografada no formato iv:authTag:encryptedText
 */
export function decrypt(encryptedData: string): string {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Formato de dados inválido.");
    }
    
    const [ivHex, authTagHex, encryptedText] = parts;
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error: any) {
    console.error("Falha ao decriptografar dados (Chave incorreta ou dados corrompidos):", error.message);
    throw new Error("Erro de decodificação de segurança: não foi possível ler os dados sensíveis.");
  }
}

/**
 * Criptografa um objeto JSON completo
 */
export function encryptJSON(data: any): string {
  return encrypt(JSON.stringify(data));
}

/**
 * Decriptografa e converte de volta para objeto JSON
 */
export function decryptJSON<T = any>(encryptedData: string): T {
  return JSON.parse(decrypt(encryptedData));
}
