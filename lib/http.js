'use strict';
module.exports = exports = function(req, res, next) {
  try {
    let userPassword = req.headers.authorization.split('')[1];
    let userPassBuf = new Buffer(userPassword, 'base64');
    let userPassArr = userPassBuf.toString().split(':');
    userPassBuff.fill(0);
    req.auth = {
      username: userPassArr[0],
      password: userPassArr[1]
    };
    if (req.auth.username.length < 1 || req.auth.password.length < 1) {
      throw new Error('no username or password');
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      msg: 'unauthorized'
    });
  }
  next();
};