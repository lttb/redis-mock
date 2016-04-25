import test from 'blue-tape';

import RedisMock from './';

test('RedisMock. Test lpush and brpop', t => {
  t.test('lpush then brpop', assert => {
    const Redis = new RedisMock();
    const redisClient = new Redis();

    const listExpected = 'test';
    const valueExpected = 0;

    redisClient.lpush(listExpected, valueExpected);

    (async () => {
      const [list, value] = await redisClient.brpop(listExpected, 0);
      assert.equal(list, listExpected);
      assert.equal(value, valueExpected);
      assert.end();
    })();
  });

  t.test('brpop then lpush', assert => {
    const Redis = new RedisMock();
    const redisPopper = new Redis();
    const redisPusher = new Redis();

    const listExpected = 'test';
    const valueExpected = 0;

    redisPopper
      .brpop(listExpected, 0)
      .then(([list, value]) => {
        assert.equal(list, listExpected);
        assert.equal(value, valueExpected);
        assert.end();
      });

    redisPusher.lpush(listExpected, valueExpected);
  });

  t.test('rpush 6 values then blpop them all', assert => {
    const Redis = new RedisMock();
    const redisClient = new Redis();

    const listExpected = 'test';
    const valuesExpected = [0, 1, 2, 3, 4, 5];

    valuesExpected.forEach(redisClient.rpush.bind(undefined, listExpected));

    async function listen() {
      const [list, value] = await redisClient.blpop(listExpected, 0);
      assert.equal(list, listExpected);
      assert.equal(value, valuesExpected.shift());
      if (!valuesExpected.length) {
        assert.end();
      }
      listen();
    }

    listen();
  });

  t.test('listen blpop then rpush 6 values', assert => {
    const Redis = new RedisMock();
    const redisPopper = new Redis();
    const redisPusher = new Redis();

    const listExpected = 'test';
    const valuesExpected = [0, 1, 2, 3, 4, 5];

    async function listen(index = 0) {
      const [list, value] = await redisPopper.blpop(listExpected, 0);
      assert.equal(list, listExpected);
      assert.equal(value, valuesExpected[index]);
      if (index + 1 === valuesExpected.length) {
        assert.end();
      }
      listen(index + 1);
    }

    listen();

    valuesExpected.forEach(redisPusher.rpush.bind(undefined, listExpected));
  });

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
