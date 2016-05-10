# redis-mock

This mock was implemented for testing business-logic using Redis features.  
API was based on [ioredis](https://github.com/luin/ioredis) API.

### Current features:
* Pub/Sub
* [lr]push / b?[rl]pop
* onevent listeners

#### Why?

Of course, your services must be isolated from the IO, almost always has to be an abstract wrapper. And, of course, to evaluate your system you need real Redis. 
But this mock allows you to easily test the application without worrying about deploying Redis, about Redis current state and storage, and it's easy to implement various breakpoints in the internal API, etc. You can fearlessly completely clean RedisMockStore for each test or share RedisMockStore for a few specific tests, forming a simple integration test for example.
