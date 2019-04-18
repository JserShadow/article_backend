'use strict';
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const ArticleTypes = app.model.define('article_types', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: STRING(100),
  });

  return ArticleTypes;
};
