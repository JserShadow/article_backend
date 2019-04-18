'use strict';

const Controller = require('egg').Controller;
const qiniu = require('qiniu');
const moment = require('moment');

class ArticlesController extends Controller {
  async types() {
    const { ctx, app } = this;
    const result = await app.mysql.query('select * from article_types');
    ctx.body = {
      data: result,
      code: 1,
      msg: '成功',
    };
  }
  async addType() {
    const { ctx, app } = this;
    try {
      const current = moment().format('YYYY-MM-DD hh:mm:ss');
      await app.mysql.insert('article_types', { ...ctx.request.body, created_at: current, updated_at: current });
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
  async deleteType() {
    const { ctx, app } = this;
    try {
      await app.mysql.delete('article_types', ctx.request.body);
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
  async getUpToken() {
    const { ctx, app } = this;
    const { accessKey, secretKey, bucket } = app.config;
    try {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const options = {
        scope: bucket,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      ctx.body = {
        data: uploadToken,
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
}

module.exports = ArticlesController;
