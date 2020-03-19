const express = require('express');
const router = express.Router();
const template = require('../lib/template.js')
const shortid = require('shortid');
const db = require('../lib/db');
const bcrypt = require('bcrypt');

module.exports = module.exports = function(passport){
  router.get('/login',function(request,response){
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
  
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red">${feedback}</div>
    <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p>
          <input type="password" name="password" placeholder="password">
        </p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  
  })
  
  router.post('/login_process',
    passport.authenticate('local', {
        successRedirect : '/',//로그인이 됐을때
        failureRedirect: '/auth/login',//로그인이 안됐을때
        failureFlash: true,
        successFlash: true
    })
  )

  router.get('/register',function(request,response){
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
  
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red">${feedback}</div>
    <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="password" name="password2" placeholder="password"></p>
        <p><input type="text" name="displayName" placeholder="display name"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
    `, '');
    response.send(html);
  
  })

  router.post('/register_process',function(request,response){
    // 아이디 중복확인,패스워드 확인하기
       var post = request.body;
       var email = post.email;
       var password = post.password;
       var password2 = post.password2;
       var displayName = post.displayName;

       if(password !== password2){
          request.flash('error','Password must same!');
          response.redirect('/auth/register');
       }else{
        bcrypt.hash(password,10,function(err,hash){
          var user = {
            id:shortid.generate(),
            email:email,
            password:password,
            displayName:displayName
          };
            db.get('users').push(user).write();
            request.login(user, function(err){
              return response.redirect('/');
            })
        })
       }
     });

  router.get('/logout',function(request,response){
 
    request.logout();
    request.session.save(function(){
      response.redirect('/');
    })
  })
  return router;
};







