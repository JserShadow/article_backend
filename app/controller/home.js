'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const html = fs.readFileSync(path.resolve(__dirname + '/../public/index.html')).toString('utf8');
    ctx.set('content-type', 'text/html');
    ctx.body = html;
  }
}

module.exports = HomeController;
