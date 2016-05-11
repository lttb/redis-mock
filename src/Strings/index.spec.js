import test from 'blue-tape';

import RedisMock from '../';

test('RedisMock. Test Strings', t => {
  t.test('Test Set Key', async assert => {
    const Redis = new RedisMock();
    const redisClient = new Redis();

    assert.equal(await redisClient.set('test', 1000), 'OK');
  });

  t.test('Test Set Key with wrong options', async assert => {
    const Redis = new RedisMock();
    const redisClient = new Redis();

    redisClient.set('test', 1000, 'KX').catch(error =>
      assert.equal(error, 'ERR syntax error'));

    redisClient.set('test', 1000, 'EX').catch(error =>
      assert.equal(error, 'ERR value is not an integer or out of range'));

    redisClient.set('test', 1000, 'EX', 10, 'KX').catch(error =>
      assert.equal(error, 'ERR syntax error'));

    redisClient.set('test', 1000, 'EX', 10, 'PX', 1000).catch(error =>
      assert.equal(error, 'ERR syntax error'));

    redisClient.set('test', 1000, 'EX', 'KX').catch(error =>
      assert.equal(error, 'ERR value is not an integer or out of range'));

    redisClient.set('test', 1000, 'XX', 'NX').catch(error =>
      assert.equal(error, 'ERR syntax error'));
  });
});
