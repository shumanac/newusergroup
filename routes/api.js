var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Group = require('../models/groups');
var Application = require('../models/application');
var seedGroup = require("../models/group-seeder");


// User signup
router.post('/signup', function(req, res, err) {
   
    if (!req.body.username || !req.body.password || !req.body.group) {
      res.json({success: false, msg: 'Please pass username, password and group name.'});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        group: req.body.group
      })
      
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successfully created new user.'});
      });
    }
  });


//Sign in to user account

  router.post('/signin', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret,{
              expiresIn: 604800 //1 week
            });
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };


//To assign members to group

router.post('/assign-member',function(req, res) {
  if (!req.body.users || !req.body.group) {
    res.json({success: false, msg: 'Please pass group title and user.'});
  } else {
    var newGroup = new Group({
      group: req.body.group,
      users: req.body.users
    })
    User.findOne({
      username: req.body.users
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
          Group.findOne({
            group: req.body.group,
            users: req.body.users
          }, function(err, groupData){
            if(err) throw err;

            if(!groupData){
              newGroup.save(function(err) {
                console.log(err);
                if (req.body.group= newGroup.group) {
                
                 // return res.json({success: false, msg: 'Group Name already exists.'});   // cannot create duplicate group 
                }
                res.json({success: true, msg: 'Successfully created new group.'});
              });

            }else{
               res.json({success: false, msg: 'Same group details exist'});
            }

          })
        
      } else {
        res.status(401).send({success: false, msg: ' User already exist.'});
          }
        });
 
  }
  });

  
// Creating application and assigning groups to those applications

router.post('/create-app', function(req, res, err) {
  
   if (!req.body.applicationTitle ||  !req.body.group) {
     res.json({success: false, msg: 'Please pass application title and group name.'});
   } else {
     var newApp = new Application({
      applicationTitle: req.body.applicationTitle,
      group: req.body.group
     })
     
     newApp.save(function(err) {
       if (err) {
         console.log(err);
         return res.json({success: false, msg: 'Application already exists.'});
       }
       res.json({success: true, msg: 'Successfully created new Application.'});
     });
   }
 });


 //User access to the application
 // user who are belongs to group can only access application. Also, access to application depends on the user 

 router.post('/application-assigned', function(req, res, err) {

  if (!req.body.users || !req.body.applicationTitle) {
    res.json({success: false, msg: 'Please pass group title and user.'});
  } else {
    var newGroup = new Group({
      group: req.body.group,
      users: req.body.users
    })
    User.findOne({
      username: req.body.users
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
         res.json("Sorry your access is denied");
        
      } else {
        res.status(201).send({success: true, msg: 'Welcome to the application'});
          }
        });
 
  }
   
 });

 router.get('/userlist', function(req, res) {
  

    User.find({}, function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user._id] = user;
      });
  
      res.send(userMap);  
    });
 
     
   });

   //searching users by group

   router.get('/userlistbygroup/:group', function(req, res) {

  
    User.find({ group: req.params.group}, function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user] = user.group;
      });
  
      res.send(userMap);  
    });
     });

  
   
// searching groups by application


router.get('/grouplistbyapp/:app', function(req, res) {
  
 
    Application.find({ applicationTitle: req.params.app}, function(err, app) {
       
    
        res.send(app);  
      });
       });
 

// searching users by application

router.get('/userlistbyapp/:app', function(req, res) {
 
  
  
  User.find({ application: req.params.app}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user] = user.group;
    });

    res.send(userMap);  
  });
        });
 

   
 
  
  // Application.
  // find({ applicationTitle: req.params.app}).
  // populate('user').
  // exec(function(error, users) {
    
  
  //   res.send(users); // Date associated with user
  // });
  


 
   
      
 




  module.exports = router;