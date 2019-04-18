'use strict';
const { Service } = require('egg');
const uuid = require('uuid');
const EXPIRE = 24 * 3600 * 1000;

class UserService extends Service {
  async setCookie(uid) {
    const token = uuid.v1();
    try {
      await this.app.redis.set(token, uid, 'EX', EXPIRE.toString());
      console.log(token);
      await this.ctx.cookies.set(this.app.keys[0], token, {
        maxAge: EXPIRE,
        encrypt: true,
      });
      console.log(uid);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async checkUser() {
    const token = await this.ctx.cookies.get(this.app.keys[0], {
      encrypt: true,
    });
    const userId = this.app.redis.get(token);
    if (userId) {
      return userId;
    }
    return null;
  }
  async deleteToken() {
    try {
      const token = await this.ctx.cookies.get(this.app.keys[0], {
        encrypt: true,
      });
      await this.app.redis.del(token);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = UserService;
