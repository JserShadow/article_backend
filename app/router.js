'use strict';

const addPrefix = router => `/back_end/${router}`;

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 欢迎接口
   */
  router.get(addPrefix(''), controller.home.index);

  /**
   * users
   * @desc 处理用户登录、注册、登出
   */
  router.post(addPrefix('users/login'), controller.users.login);
  router.post('/back_end/users/signup', controller.users.signup);
  router.post('/back_end/users/logout', controller.users.logout);
  router.post('/back_end/users/change', controller.users.change);
  router.post('/back_end/users/delete', controller.users.deleteUser);
  router.post('/back_end/users/change_pwd', controller.users.changePwd);
  router.post('/back_end/users/check', controller.users.checkUser);
  router.get(addPrefix('users/get'), controller.users.getUser);
  router.get(addPrefix('users/get/all'), controller.users.getAllUsers);

  /**
   * article
   * @desc 处理文献类型，文献详情等
   */
  router.get(addPrefix('article/type'), controller.articles.types);
  router.post(addPrefix('article/type/add'), controller.articles.addType);
  router.post(addPrefix('article/type/delete'), controller.articles.deleteType);

  router.get(addPrefix('article/upload_token'), controller.articles.getUpToken);
};
