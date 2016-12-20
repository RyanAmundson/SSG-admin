const routes = require('./users');
const Router = require('express').Router;
const bodyParser = require('body-parser').json();

const userRouter = module.exports = exports = Router();

userRouter.get('/', routes.list);
userRouter.get('/:username', routes.show);
userRouter.post('/', routes.create);
userRouter.post('/:username', routes.edit);
userRouter.delete('/', routes.del);
