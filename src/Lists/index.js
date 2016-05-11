export default (redisListStorage, redisEmitter) => {
  const popHelper = method => listName =>
    [listName, redisListStorage.get(listName)[method]()] || null;

  const bPopHelper = method => listName => new Promise(resolve => {
    if (redisListStorage.has(listName) && redisListStorage.get(listName).length) {
      resolve(popHelper(method)(listName));
    }

    redisEmitter.once(`push:${listName}`, () =>
      resolve(popHelper(method)(listName)));
  });

  const pushHelper = method => (listName, value) => {
    if (!redisListStorage.has(listName)) {
      redisListStorage.set(listName, []);
    }

    redisListStorage.get(listName)[method](value);
    redisEmitter.emit(`push:${listName}`, value);
  };

  return {
    brpop: bPopHelper('pop'),
    rpop: popHelper('pop'),

    blpop: bPopHelper('shift'),
    lpop: popHelper('shift'),

    lpush: pushHelper('unshift'),
    rpush: pushHelper('push'),
  };
};
