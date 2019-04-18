'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, TEXT } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: STRING(30),
    user_pwd: STRING(32),
    user_email: STRING(32),
    user_phone: STRING(11),
    is_admin: BOOLEAN,
    last_sign_in_at: DATE,
    focus_articles: TEXT,
  });

  return User;
};
