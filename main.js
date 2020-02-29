const express = require('express')
const app = express(); //express는 application 객체를 리턴해준다
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const indexRouter = require('./routes/index')
const topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());//미들웨어를 리턴해서 app.use에 장착
app.get('*',function(request, response, next){
  fs.readdir('./data',function(error,filelist){
    request.list = filelist;
    next();//다음 미들웨어를 실행함.
  });
});
app.use('/',indexRouter);
app.use('/topic',topicRouter);

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
