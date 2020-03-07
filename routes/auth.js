const express = require('express');
const router = express.Router();
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const fs = require('fs');
const template = require('../lib/template.js')

var authData = {
  email:"egoing777@gmail.com",
  password:"111111",
  nickname:"egoing"
}

router.get('/login',function(request,response){
  
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
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

router.post('/login_process',function(request,response){

  var post = request.body;
  var email = post.email;
  var password = post.password;

  if(email==authData.email && password==authData.password){
    request.session.is_logined = true
    request.session.nickname = authData.nickname
    //세션이 저장되기전에 redirection이 먼저 실행되는 것을 방지하기 위해, save()를 이용해
    //세션 저장을 먼저하고, 그 콜백함수로 redirection을 줘서 저장이 된 후 실행 되게 함.
    request.session.save(function(){
      response.redirect('/');
    });
  
  }else{
    response.send('Who ? ');
  }
  
});

router.get('/logout',function(request,response){
  request.session.destroy(function(err){
    response.redirect('/');
  })
})

module.exports = router;







