export default redisKeyStorage => ({
  del: (...keys) =>
    keys.reduce((acc, key) => (redisKeyStorage.delete(key)
      ? acc + 1
      : acc), 0),

  exists: (...keys) =>
    keys.reduce((acc, key) => (redisKeyStorage.has(key)
      ? acc + 1
      : acc), 0),

  expire: (key, expireTime) => {
    if (!redisKeyStorage.has(key)) {
      return 0;
    }
    const value = redisKeyStorage.get(key);
    redisKeyStorage.set(key, { ...value, expireTime });

    return 1;
  },

  pttl(key) {
    if (redisKeyStorage.has(key)) {
      const { expire } = redisKeyStorage.get(key);
      if (expire) {
        return expire - Date.now();
      }

      return -1;
    }

    return -2;
  },

  ttl(key) {
    const expired = this.pttl(key);
    if (expired > 0) {
      return Math.round(expired / 1000);
    }

    return expired;
  },
});
