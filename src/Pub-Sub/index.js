export default redisEmitter => ({
  subscribe(...topics) {
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

  publish(topic, message) {
    redisEmitter.emit(topic, message);
    return redisEmitter.listenerCount(topic);
  },
});
