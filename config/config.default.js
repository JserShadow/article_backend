/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554958820414_7109';

  // add your middleware config here
  // config.middleware = [ 'checkUsers' ];
  // config.checkUsers = {
  //   key: appInfo.name + '_1554958820414_7109',
  // };

  // add your user config here
  const userConfig = {
    accessKey: 'DhsDWIMUrCTF_R-ff01w9ESN7vvKyLle4hzwYLJf',
    secretKey: 'tgVJBh9Iu_mGFGbdWoiaO_4SJDBc4-hrV4yFJDsi',
    bucket: 'newarticle',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mysql = {
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'zhuxiaojun1029',
      // 数据库名
      database: 'article',
    },
  };
  config.sequelize = { // egg-sequelize 配置
    dialect: 'mysql', // db type
    database: 'article',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'zhuxiaojun1029',
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: 'auth',
      db: 0,
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
