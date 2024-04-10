import dotenv from "dotenv";
import { resolve } from "path";

// Carrega as variáveis de ambiente do arquivo .env.test
dotenv.config({ path: resolve(__dirname, "..", ".env.test") });
