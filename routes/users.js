var URL = require('url');

var errors = require('../models/error');
var User = require('../models/User');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.username);
}

/**
 * GET /users
 */
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return res.status(500).json(err);
        res.status(200).json({
            User: User,
            users: users,
            username: req.query.username,   // Support pre-filling create form
            error: req.query.error,     // Errors creating; see create route
        });
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }, function (err, user) {
        if (err) {
            if (err instanceof errors.ValidationError) {
                return res.json({msg: err.message});
            } else {
                return res.status(422).json({msg: err.message.indexOf('already exists') ? 'User already exists' : 'Internal Error'});
            }
        }
        var user = user['_node'].properties.username;
        res.status(201).json({msg: "Created User: "+ user});
    });
};

/**
 * GET /users/:username
 */
exports.show = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return res.status(404).json({msg: 'No such user.'});
        user.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            user = sanitize(user);
            others = others.map(sanitize);
            following = following.map(sanitize);
            res.status(200).json({
                user: user,
                following: following,
                others: others,
                error: req.query.error,     // Errors editing; see edit route
            });
        });
    });
};

/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return res.status(404).json({msg: 'No such user.'});
        var old = user._node.properties;
        user.patch(req.body, function (err) {
        if (err) {
          if (err instanceof errors.ValidationError) {
            return res.json({msg: err.message});
          } else {
            return res.status(422).json({msg: err.message.indexOf('already exists') ? 'User already exists' : 'Internal Error'});
          }
        }
        var update = Object.keys(old).filter((prop) => {
          return req.body[prop] !== old[prop]
        });
      res.status(200).json({user: sanitize(user), update: update});
    })
  });
};

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    User.get(req.body.username, function (err, user) {
        if (err) res.json({msg: 'No such user.'});
        user.del(function (err) {
            if (err) return next(err);
            res.json({msg: 'Deleted User: '+ user});
        });
    });
};

/**
 * POST /users/:username/follow {otherUsername}
 */
exports.follow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // This is the source user, so e.g. 404 page?
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            // TODO: Gracefully handle "no such user" error somehow.
            // This is the target user, so redirect back to the source user w/
            // an info message?
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect(getUserURL(user));
            });
        });
    });
};

/**
 * POST /users/:username/unfollow {otherUsername}
 */
exports.unfollow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // This is the source user, so e.g. 404 page?
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            // TODO: Gracefully handle "no such user" error somehow.
            // This is the target user, so redirect back to the source user w/
            // an info message?
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect(getUserURL(user));
            });
        });
    });
};

var sanitize = (x)=>{return {id: x._node._id, username: x._node.properties.username} };
