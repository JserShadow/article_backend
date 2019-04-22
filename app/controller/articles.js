'use strict';

const Controller = require('egg').Controller;
const qiniu = require('qiniu');
const moment = require('moment');
const _ = require('lodash');

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
  async getArticles() {
    const { ctx, app: { mysql } } = this;
    const query = ctx.request.query;
    console.log(query);
    let sql = 'select * from articles';
    if (Object.keys(query).length) {
      sql = sql + ' where ';
      for (const key in query) {
        sql = `${sql}${key}='${query[key]}' and `;
      }
      sql = sql.slice(0, -5);
    }
    const result = await mysql.query(sql);
    ctx.body = {
      data: result,
      code: 1,
      msg: '成功',
    };
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
  async addArticle() {
    const { ctx, app: { mysql } } = this;
    try {
      const current = moment().format('YYYY-MM-DD hh:mm:ss');
      const result = await mysql.get('article_types', { id: ctx.request.body.article_type });
      await mysql.insert('articles', { ...ctx.request.body, created_at: current, updated_at: current, article_type_name: result.name });
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
  async getDetail() {
    const { ctx, app: { mysql } } = this;
    try {
      const result = await mysql.get('articles', ctx.request.query);
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
          msg: '文献不存在',
        };
      }
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
  async deleteArticle() {
    const { ctx, app: { mysql } } = this;
    try {
      await mysql.delete('articles', ctx.request.body);
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
  async changeArticle() {
    const { ctx, app: { mysql } } = this;
    try {
      const result = await mysql.get('article_types', { id: ctx.request.body.article_type });
      await mysql.update('articles', { ...ctx.request.body, updated_at: moment().format('YYYY-MM-DD hh:mm:ss'), article_type_name: result.name });
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
  async focus() {
    const { ctx, app: { mysql } } = this;
    try {
      const userId = await ctx.service.users.checkUser();
      const user = await mysql.get('users', { id: userId });
      const article = await mysql.get('articles', ctx.request.body);
      if (article.focus_people) {
        article.focus_people = JSON.stringify([ ...JSON.parse(article.focus_people), userId ]);
      } else {
        article.focus_people = JSON.stringify([ userId ]);
      }
      console.log(article);
      await mysql.update('articles', article);
      if (user.focus_articles) {
        user.focus_articles = JSON.stringify([ ...JSON.parse(user.focus_articles), article.id ]);
      } else {
        user.focus_articles = JSON.stringify([ article.id ]);
      }
      console.log(user);
      await mysql.update('users', user);
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
  async unfocus() {
    const { ctx, app: { mysql } } = this;
    try {
      const userId = await ctx.service.users.checkUser();
      const user = await mysql.get('users', { id: userId });
      const article = await mysql.get('articles', ctx.request.body);
      article.focus_people = JSON.stringify(_.remove(JSON.parse(article.focus_people), n => n !== userId));
      await mysql.update('articles', article);
      user.focus_articles = JSON.stringify(_.remove(JSON.parse(user.focus_articles), n => n !== article.id));
      await mysql.update('users', user);
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
  async getFocusList() {
    const { ctx, app: { mysql } } = this;
    try {
      const userId = await ctx.service.users.checkUser();
      const user = await mysql.get('users', { id: userId });
      const list = [];
      if (user.focus_articles) {
        for (const item of JSON.parse(user.focus_articles)) {
          const article = await mysql.get('articles', { id: item });
          list.push(article);
        }
      }
      ctx.body = {
        data: list,
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
