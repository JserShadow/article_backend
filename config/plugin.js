'use strict';

/** @type Egg.EggPlugin */
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
exports.static = {
  enable: true,
};
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
