var Bbs = require('../persister/bbs');
var Allocation = require('../persister/allocation');
var parseurl = require('parseurl');
var User = require('../persister/user');
var mongoose = require('mongoose');

module.exports = function (app, passport) {

    /* GET home page. */
    app.use(function (req, res, next) {
        req.session._garbage = Date();
        req.session.touch();
        if (!req.session.views) {
            req.session.views = {};
        }
        // get the url pathname
        var pathname = parseurl(req).pathname;
        // count the views
        req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
        console.log( req.session.views);
        next();
    });
    app.use(isMiddlewareAuth);

    app.get('/', function (req, res) {
        res.redirect('/admin-management');
    });

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/login', function (req, res) {
        res.render('template/login', {
            message: req.flash('message')
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

 

    app.get('/signup', function (req, res) {
        res.render('template/signup', {
            message: req.flash('message')
        });
    });

    /* Handle Registration POST */
    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.get('/admin-management', function (req, res) {
        res.render('template/readme', {});
    });
    app.get('/dashboard', function (req, res) {
        res.render('template/index', {});
    });
    app.get('/flot', function (req, res) {
        res.render('template/flot', {});
    });
    app.get('/morris', function (req, res) {
        res.render('template/morris', {});
    });
    app.get('/tables', function (req, res) {
        res.render('template/tables', {});
    });
    app.get('/forms', function (req, res) {
        res.render('template/forms', {});
    });
    app.get('/panelswells', function (req, res) {
        res.render('template/panelswells', {});
    });
    app.get('/buttons', function (req, res) {
        res.render('template/buttons', {});
    });
    app.get('/notifications', function (req, res) {
        res.render('template/notifications', {});
    });
    app.get('/typography', function (req, res) {
        res.render('template/typography', {});
    });
    app.get('/icons', function (req, res) {
        res.render('template/icons', {});
    });
    app.get('/grid', function (req, res) {
        res.render('template/grid', {});
    });
    app.get('/blank', function (req, res) {
        res.render('template/blank', {});
   });
   app.get('/restriction', function (req, res) {
        res.render('template/restriction', {});        
   });
   app.get('/bbs', function (req, res) {
        res.render('template/bbs', {});
    });

    app.get('/bbs/list', function (req, res) {
        Bbs.find({},
            function (err, bbs) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log error & redirect back
                res.send(bbs);
            }
        );
    });

    app.post('/bbs/create', function (req, res) {

        var newBbs = new Bbs();
        // set the user's local credentials
        newBbs.content = req.param('content');
        newBbs.vote = 0;
        newBbs.username = req.user.username;

        // save the user
        newBbs.save(function (err) {
            if (err) {
                console.log('Error in Saving bbs: ' + err);
                res.send({
                    "result": false
                });
            }
            res.send({
                "result": true
            });
        });
    });

    app.post('/bbs/delete', function (req, res) {
        // set the user's local credentials
        var id = req.param('id');
        Bbs.findByIdAndRemove(id, function (err) {
            if (err) {
                console.log('Error in Saving bbs: ' + err);
                res.send({
                    "result": false
                });
            }
            res.send({
                "result": true
            });
        })


    });
    app.post('/bbs/update', function (req, res) {
        // set the user's local credentials
        var id = req.param('id');

        Bbs.findById(id, function (err, bbs) {
            if (err) {
                console.log('Error in Saving bbs: ' + err);
                res.send({
                    "result": false
                });
            }
            bbs.vote += 1;
            bbs.save(function () {
                res.send({
                    "result": true
                });
            });

        });
    });

    app.post('/allocation/create', function (req, res) {
        var data = req.body.c;
        var parseJson = JSON.parse(data);
        Object.keys(parseJson).forEach(function (key) {
            console.log(key);
            console.log(parseJson[key]);
            var alC = new Allocation();
            alC.allotment_name = key;
            alC.value = parseJson[key];
            alC.save(function (err) {
                if (err) {
                    console.log('Error in Saving bbs: ' + err);
                    res.send({
                        "result": false
                    });
                } else {
                    console.log('no error');
                }
            });
        });
        res.send({
            "result": true
        });

    });

};
// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

var pathSearch = ['/login','/signup','/restriction'];
var adminPath = ['/blank','/dashboard'];
var superAdmin = [];
var isMiddlewareAuth = function(req,res,next){
    var pathname = parseurl(req).pathname;
    var newId = mongoose.Types.ObjectId(req.session.passport.user);
    //console.log(req.path);
     if(pathSearch.indexOf(req.path)===-1){
        User.find({"_id":newId}, function(err, user) {
            console.log("userinfo",user);
            if(user.length > 0){
                if(typeof user[0].role !=='undefined' &&  user[0].role ===1){
                    if(adminPath.indexOf(req.path)!==-1){
                        res.locals.user = user;
                        return next(); 
                    }else{
                        res.redirect('/restriction');
                        return next(); 
                    }
                }
                else if(typeof user[0].role !=='undefined' && user[0].role ===0){
                    console.log('user');
                    res.locals.user = user;
                    return next(); 
                }else{
                    console.log('no users');
                    res.locals.user = user;
                    return next(); 
                }
            }else{
                req.logout();
                res.redirect('/login');
                next();
            }
        
        });
      }else{
        return next(); 
      }       
};