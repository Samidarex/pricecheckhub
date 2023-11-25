import Redis from 'ioredis';

const redis = new Redis();

export const cacheService = {
    get: async <T>(key: string): Promise<T | null> => {
        const cachedData = await redis.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    },

    set: async <T>(key: string, data: T, expirationInSeconds: number): Promise<boolean> => {
        // Check if data is not null or undefined
        if (data !== null && data !== undefined) {
            // Use SETNX command to set the key only if it does not exist
            const setIfNotExists = await redis.setnx(key, JSON.stringify(data));

            // If the key did not exist, set the expiration time
            if (setIfNotExists === 1) {
                await redis.expire(key, expirationInSeconds);
                return true;
            }
        } else {
            // If data is null or undefined, remove the key
            await redis.del(key);
        }

        return false;
    },

    quit: async (): Promise<void> => {
        await redis.quit();
    },
};


export async function getAllDataFromCache() {
    const allKeys: string[] = await redis.keys('*');
  
    const allValues: (string | null)[] = await redis.mget(...allKeys);
  
    const cacheData: Record<string, any> = {};
    allKeys.forEach((key, index) => {
      if (allValues[index] !== null) {
        cacheData[key] = JSON.parse(allValues[index]!);
      }
    });
  
    console.log('All data from Redis cache:', cacheData);
  
    await redis.quit();
}

export async function getMemoryInfo() {
    const info = await redis.info('memory');
    console.log('Memory info:', info);
  
    await redis.quit();
}