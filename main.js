const express = require('express')
const app = express(); //express는 application 객체를 리턴해준다
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());//미들웨어를 리턴해서 app.use에 장착
app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized: true,
  store: new FileStore()
}))

var authData = {
  email:"egoing777@gmail.com",
  password:"111111",
  nickname:"egoing"
}

//passport 설치
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

  //passport를 express에 설치
app.use(passport.initialize());
//session을 사용하겠다는 것.
app.use(passport.session());

passport.serializeUser(function(user,done){//로그인애 성공했을때 호출되어 사용자의 식별자를 session store에 저장한다.
  console.log('serializeUser: ', user);
  done(null, user.email);//두번째인자는 사용자의 식별자
});

passport.deserializeUser(function(id,done){//로그인 후 페이지 방문할때마다 호출됨. id값으로 사용자의 데이터를 가져옴.
  console.log('deserializeUser: ', id);
  done(null, authData);
})

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done){
    console.log('LocalStrategy: ', username+', '+password);
    if(username === authData.email){
      console.log(1);
      if(password === authData.password){
        console.log(2);
        return done(null,authData);
      }else{
        console.log(3);
        return done(null,false,{
          message: 'Incorrect password.'
        })
      }
    }else{
      console.log(4);
      return done(null,false,{
        message: 'Incorrect username.'
      });
    }
    /*
    User.findOne({
      username: username
    }, function(err,user){
      if(err){
        return done(err);
      }
      if(!user){
        return done(null,false,{
          message: 'Incorrect username.'
        });
      }
      if(!user.validPassword(password)){
        return done(null,false,{
          message: 'Incorrect password.'
        });
      }
      return done(null,user);
    }
    );
    */
  }
))

app.post('/auth/login_process',
  passport.authenticate('local', {
      successRedirect : '/',//로그인이 됐을때
      failureRedirect: '/auth/login'//로그인이 안됐을때
  })
)

app.get('*',function(request, response, next){
  fs.readdir('./data',function(error,filelist){
    request.list = filelist;
    next();//다음 미들웨어를 실행함.
  });
});

const indexRouter = require('./routes/index')
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');
app.use('/',indexRouter);
app.use('/topic',topicRouter);
app.use('/auth',authRouter);

//없는 페이지를 찾을 때 에러 처리
app.use(function(req,res,next){
  res.status(404).send('Sorry cant find that !');
})

//에러를 핸들링 하는 미들웨어
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send('Somthing broke!');
})

// app.listen(3000,()=>console.log('Example app listening on port 3000'));
app.listen(3000,function(){
  console.log('Example app listening on port 3000 ~');
})
















/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
     
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
     
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/
