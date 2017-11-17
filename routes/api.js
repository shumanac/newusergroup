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
  if (!req.body.users || !req.body.groupTitle) {
    res.json({success: false, msg: 'Please pass group title and user.'});
  } else {
    var newGroup = new Group({
      groupTitle: req.body.groupTitle,
      users: req.body.users
    })
    User.findOne({
      username: req.body.users
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
          Group.findOne({
            groupTitle: req.body.groupTitle,
            users: req.body.users
          }, function(err, groupData){
            if(err) throw err;

            if(!groupData){
              newGroup.save(function(err) {
                console.log(err);
                if (req.body.groupTitle = newGroup.groupTitle) {
                
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

  if (!req.body.users) {
    res.json({success: false, msg: 'You have to be a user to enter into the application.'});
  }else{
       var users = req.body.users
  
    User.find(function (err, users) {
      if (err) return  console.error(err);
     
        if(req.body.users = users){
          console.log("i should die");
        }else{
          console.log("u should die");
        }
      
    })



  }
   
 });

  module.exports = router;