// src/utils/logger.ts
import { config } from '../config/env';

/**
 * Utilitaire de logging simple et coloré
 */
class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, ...args: any[]): void {
    console.log(`ℹ️  [${this.getTimestamp()}] INFO:`, message, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(`✅ [${this.getTimestamp()}] SUCCESS:`, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`⚠️  [${this.getTimestamp()}] WARN:`, message, ...args);
  }

  error(message: string, error?: any): void {
    console.error(`❌ [${this.getTimestamp()}] ERROR:`, message);
    if (error && config.isDevelopment) {
      console.error(error);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (config.isDevelopment) {
      console.log(`🐛 [${this.getTimestamp()}] DEBUG:`, message, ...args);
    }
  }
}

export const logger = new Logger();