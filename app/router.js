'use strict';

const addPrefix = router => `/back_end/${router}`;

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller: { users, articles, home } } = app;
  /**
   * users
   * @desc 处理用户登录、注册、登出
   */
  router.post(addPrefix('users/login'), users.login);
  router.post(addPrefix('users/signup'), users.signup);
  router.post(addPrefix('users/logout'), users.logout);
  router.post(addPrefix('users/change'), users.change);
  router.post(addPrefix('users/delete'), users.deleteUser);
  router.post(addPrefix('users/change_pwd'), users.changePwd);
  router.post(addPrefix('users/check'), users.checkUser);
  router.get(addPrefix('users/get'), users.getUser);
  router.get(addPrefix('users/get/all'), users.getAllUsers);

  /**
   * article
   * @desc 处理文献类型，文献详情等
   */
  router.get(addPrefix('article/type'), articles.types);
  router.post(addPrefix('article/type/add'), articles.addType);

  router.get(addPrefix('article/upload_token'), articles.getUpToken);
  router.get(addPrefix('article/all'), articles.getArticles);
  router.get(addPrefix('article/detail'), articles.getDetail);
  router.post(addPrefix('article/add'), articles.addArticle);
  router.post(addPrefix('article/delete'), articles.deleteArticle);
  router.post(addPrefix('article/change'), articles.changeArticle);
  router.post(addPrefix('article/focus'), articles.focus);
  router.post(addPrefix('article/unfocus'), articles.unfocus);
  router.get(addPrefix('article/focus_list'), articles.getFocusList);

  router.get('*', home.index); // 上面是接口，其余所有路径都打到前端
};
