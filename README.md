# redis-mock

This mock was implemented for testing business-logic using Redis features.  
API was based on [ioredis](https://github.com/luin/ioredis) API with Promises.

### Current features:
* Pub/Sub
* Lists: [lr]push / b?[rl]pop
* Strings: get, set
* Keys: del, exists, expire, pttl, ttl
* Sets: sadd, srem, sismember
* onevent listeners
