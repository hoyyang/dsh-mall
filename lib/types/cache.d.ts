/** Derived-cache root shared by all dsh-mall refresh channels. */
export declare function cacheFile(profile: string, name: string): string;
/** Persist derived JSON atomically, creating a fresh profile's directory first. */
export declare function writeCacheJson(profile: string, name: string, value: unknown): void;
