export default redisSetStorage => {
  const setHelper = method => (setName, ...elems) => {
    if (!redisSetStorage.has(setName)) {
      redisSetStorage.set(setName, new Set());
    }

    return Math.abs(elems.reduce((addedTotal, value) =>
      redisSetStorage.get(setName)[method](value).size
    , 0) - redisSetStorage[setName].size);
  };

  return {
    sadd: setHelper('add'),
    srem: setHelper('delete'),
    sismember: (setName, elem) => Number(
      redisSetStorage[setName] && redisSetStorage[setName].has(elem)),
  };
};
