const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
  }

  async connect() {
    if (!this.client) {
      this.client = redis.createClient({
      });
      this.client.on('error', (err) => console.error('Redis Client Error', err));
      if (typeof this.client.connect === 'function') {
        await this.client.connect();
      }
      console.log('Connected to Redis');
    }
  }

  async isAlive() {
    if (!this.client) await this.connect();
    try {
      if (typeof this.client.ping === 'function') {
        await this.client.ping();
      } else {
        // Fallback for older versions
        return new Promise((resolve) => {
          this.client.ping((err) => {
            resolve(!err);
          });
        });
      }
      return true;
    } catch (error) {
      console.error('Redis isAlive error:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.client) await this.connect();
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  async set(key, value, duration) {
    if (!this.client) await this.connect();
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  async del(key) {
    if (!this.client) await this.connect();
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
