import EventEmitter from 'events';

export default () => {
  const redisEmitter = new EventEmitter();

  const redisStorage = {
    lists: {},
  };

  const popHelper = method => listName =>
    [listName, redisStorage.lists[listName][method]()] || null;

  const bPopHelper = method => listName => new Promise(resolve => {
    if (redisStorage.lists[listName] && redisStorage.lists[listName].length) {
      resolve(popHelper(method)(listName));
    }

    redisEmitter.once(`push:${listName}`, () =>
      resolve(popHelper(method)(listName)));
  });

  const pushHelper = method => (listName, value) => {
    if (!redisStorage.lists[listName]) {
      redisStorage.lists[listName] = [];
    }

    redisStorage.lists[listName][method](value);
    redisEmitter.emit(`push:${listName}`, value);
  };

  return () => ({
    on: (topic, cb) => redisEmitter.on(topic, cb),

    subscribe: (...topics) => {
      let cb;
      if (typeof topics[topics.length - 1] === 'function') {
        cb = topics.pop();
      }

      topics.forEach(topic => {
        redisEmitter.on(topic, message => {
          redisEmitter.emit('message', topic, message);
        });
      });

      if (cb) {
        cb(null, topics.length);
      }
    },

    publish: (topic, message) => {
      redisEmitter.emit(topic, message);
    },

    brpop: bPopHelper('pop'),
    rpop: popHelper('pop'),

    blpop: bPopHelper('shift'),
    lpop: popHelper('shift'),

    lpush: pushHelper('unshift'),
    rpush: pushHelper('push'),
  });
};
