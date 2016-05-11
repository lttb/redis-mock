import test from 'blue-tape';

import RedisMock from '../';

test('RedisMock. Test PubSub', t => {
  t.test('subscribe and publish', assert => {
    const Redis = new RedisMock();
    const redisSub = new Redis();
    const redisPub = new Redis();

    const pubsExpected = {
      test1: 'testing1',
      test2: 'testing2',
    };

    let testIndex = 0;

    redisSub.on('message', (topic, message) => {
      testIndex++;

      assert.true(topic in pubsExpected);
      assert.equal(message, pubsExpected[topic]);

      if (testIndex + 1 === Object.keys(pubsExpected).length) {
        assert.end();
      }
    });

    redisSub.subscribe(...Object.keys(pubsExpected), (err, count) => {
      assert.equal(err, null);
      assert.equal(count, Object.keys(pubsExpected).length);
    });

    Object.entries(pubsExpected).forEach(data => redisPub.publish(...data));
  });
});
