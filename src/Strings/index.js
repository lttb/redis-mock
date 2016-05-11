export default redisKeyStorage => ({
  get: key => (redisKeyStorage.has(key)
    ? redisKeyStorage.get(key).value
    : null),

  set(key, value, ...options) {
    let expire = null;
    let isAvailable = null;

    const availableOptions = {
      ex: expireTime => Date.now() + expireTime,
      px: expireTime => Date.now() + expireTime * 1000,
      nx: () => !redisKeyStorage.has(key),
      xx: () => redisKeyStorage.has(key),
    };

    for (let i = 0; i < options.length; i++) {
      const option = options[i].toLowerCase();
      if (!availableOptions[option]) {
        return Promise.reject('ERR syntax error');
      }

      if (option === 'ex' || option === 'px') {
        if (expire !== null) {
          return Promise.reject('ERR syntax error');
        }

        const expireTime = options[++i];
        if (!Number.isInteger(expireTime)) {
          return Promise.reject('ERR value is not an integer or out of range');
        }

        expire = availableOptions[option](expireTime);
      }

      if (option === 'nx' || option === 'xx') {
        if (isAvailable !== null) {
          return Promise.reject('ERR syntax error');
        }

        isAvailable = availableOptions[option]();
        if (!isAvailable) {
          return Promise.resolve(null);
        }
      }
    }

    redisKeyStorage.set(key, { value, expire });

    return Promise.resolve('OK');
  },
});
