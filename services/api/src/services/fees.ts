import { eq } from 'drizzle-orm';
import { platformSettings } from 'database';

export interface FeeConfig {
  type: 'FIXED' | 'PERCENTAGE' | 'BOTH';
  amount?: number; // Fixed amount
  percentage?: number; // Percentage (0-100)
}

export const getFeeConfig = async (db: any, key: string, fallback: FeeConfig): Promise<FeeConfig> => {
  try {
    const setting = await db.select().from(platformSettings).where(eq(platformSettings.key, key)).get();
    if (setting && setting.value) {
      try {
        return JSON.parse(setting.value) as FeeConfig;
      } catch (e) {
        // Fallback for simple string numeric values in legacy settings
        const num = parseFloat(setting.value);
        if (!isNaN(num)) {
          return { type: 'PERCENTAGE', percentage: num };
        }
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch fee config for ${key}`, err);
  }
  return fallback;
};

export const calculateFee = (amount: number, config: FeeConfig): number => {
  let fee = 0;
  if (config.type === 'FIXED' || config.type === 'BOTH') {
    fee += (config.amount || 0);
  }
  if (config.type === 'PERCENTAGE' || config.type === 'BOTH') {
    fee += (amount * (config.percentage || 0)) / 100;
  }
  return fee;
};

export const getLimit = async (db: any, key: string, fallback: number): Promise<number> => {
  try {
    const setting = await db.select().from(platformSettings).where(eq(platformSettings.key, key)).get();
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (parsed && typeof parsed.amount === 'number') return parsed.amount;
      } catch (e) {
        const num = parseFloat(setting.value);
        if (!isNaN(num)) return num;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch limit config for ${key}`, err);
  }
  return fallback;
};
