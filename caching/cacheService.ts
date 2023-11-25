import { Redis  } from "ioredis";

const redis = new Redis();

export const cacheService = {
    get: async <T>(key: string): Promise<T | null> => {
      const cachedData = await redis.get(key);
      return cachedData ? JSON.parse(cachedData) : null;
    },
    
    set: async <T>(key: string, data: T, expirationInSeconds: number): Promise<void> => {
      await redis.set(key, JSON.stringify(data), 'EX', expirationInSeconds);
    },
  
    quit: async (): Promise<void> => {
      await redis.quit();
    },
  };