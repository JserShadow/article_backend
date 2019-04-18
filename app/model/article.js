'use strict';
module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const User = app.model.define('article', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    article_title: STRING(100),
    article_desc: STRING(100),
    article_type: STRING(32),
    article_author: STRING(32),
    article_url: TEXT,
    file_name: TEXT,
    creator_id: INTEGER,
  });

  return User;
};
