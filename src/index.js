import EventEmitter from 'events';
import Keys from './Keys';
import Strings from './Strings';
import Lists from './Lists';
import PubSub from './Pub-Sub';
import Sets from './Sets';

export default () => {
  const redisStorage = {
    lists: new Map(),
    sets: new Map(),
    keys: new Map(),
  };
  const redisEmitter = new EventEmitter();

  return () => ({
    ...new Keys(redisStorage.keys),
    ...new Strings(redisStorage.keys),
    ...new Lists(redisStorage.lists, redisEmitter),
    ...new PubSub(redisEmitter),
    ...new Sets(redisStorage.sets),
    on: (topic, cb) => redisEmitter.on(topic, cb),
  });
};
