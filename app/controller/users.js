'use strict';

const { Controller } = require('egg');
const moment = require('moment');

class UsersController extends Controller {
  async login() {
    const { ctx } = this;
    const { request: { body } } = ctx;
    try {
      const result = await this.app.mysql.get('users', body);
      if (!result) {
        ctx.body = {
          data: null,
          code: -1,
          msg: '用户名或密码错误',
        };
        return;
      }
      await this.ctx.service.users.setCookie(result.id);
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    } catch (error) {
      ctx.body = {
        data: null,
        code: -1,
        msg: '服务器发生内部错误，请联系管理员：zhuxiaojun@bytedance.com',
      };
    }
  }
  async signup() {
    const { ctx } = this;
    const { request: { body } } = ctx;
    const isExisted = await this.app.mysql.get('users', { user_name: body.user_name });
    if (isExisted) {
      ctx.body = {
        data: null,
        code: -1,
        msg: '该用户名已存在',
      };
      return;
    }
    const current = moment().format('YYYY-MM-DD hh-mm-ss');
    const data = { ...body, created_at: current, updated_at: current, is_admin: false };
    const result = await this.app.mysql.insert('users', data);
    if (result.affectedRows === 1) {
      console.log(result.affectedRows);
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    } else {
      ctx.body = {
        data: null,
        code: -1,
        msg: '注册失败',
      };
    }
  }
  async getUser() {
    const { ctx, app } = this;
    const userId = await ctx.service.users.checkUser();
    const { mysql } = app;
    const user_detail = await mysql.get('users', { id: userId });
    console.log('hello', user_detail, userId);
    ctx.body = {
      data: user_detail,
      code: 1,
      msg: '成功',
    };
  }
  async logout() {
    const { ctx } = this;
    const userId = await ctx.service.users.checkUser();
    if (userId) {
      const result = await ctx.service.users.deleteToken();
      if (result) {
        ctx.body = {
          data: null,
          code: 1,
          msg: '成功',
        };
        return;
      }
      ctx.body = {
        data: null,
        code: -1,
        msg: '失败',
      };
    } else {
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    }
  }
  async change() {
    const { ctx, app } = this;
    const userId = await ctx.service.users.checkUser();
    if (!userId) {
      ctx.body = {
        code: 201,
        data: null,
        msg: '登录过期',
      };
      return;
    }
    try {
      const current = moment().format('YYYY-MM-DD hh:mm:ss');
      const result = await app.mysql.update('users', { ...ctx.request.body, updated_at: current });
      console.log(result);
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    } catch (error) {
      ctx.body = {
        data: null,
        code: -1,
        msg: '服务器发生内部错误，请联系管理员：zhuxiaojun@bytedance.com',
      };
      console.log(error);
      this.logger.error(error);
    }
  }
  async deleteUser() {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.delete('users', ctx.request.body);
      console.log(result);
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    } catch (error) {
      ctx.body = {
        data: null,
        code: -1,
        msg: '服务器发生内部错误，请联系管理员：zhuxiaojun@bytedance.com',
      };
      console.log(error);
      this.logger.error(error);
    }
  }
  async checkUser() {
    const { ctx, app } = this;
    const result = await app.mysql.get('users', ctx.request.body);
    if (result) {
      ctx.body = {
        data: result,
        code: 1,
        msg: '成功',
      };
    } else {
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    }
  }
  async changePwd() {
    const { ctx, app } = this;
    try {
      await app.mysql.update('users', { ...ctx.request.body, updated_at: moment().format('YYYY-MM-DD hh:mm:ss') });
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    } catch (error) {
      ctx.body = {
        data: null,
        code: -1,
        msg: '服务器发生内部错误，请联系管理员：zhuxiaojun@bytedance.com',
      };
      console.log(error);
      this.logger.error(error);
    }
  }
  async getAllUsers() {
    const { ctx, app } = this;
    const result = await app.mysql.query('select * from users where is_admin=0');
    if (result) {
      ctx.body = {
        data: result instanceof Array ? result : [ result ],
        code: 1,
        msg: '成功',
      };
    } else {
      ctx.body = {
        data: null,
        code: 1,
        msg: '成功',
      };
    }
  }
}

module.exports = UsersController;
