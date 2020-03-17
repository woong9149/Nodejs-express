const express = require('express');
const router = express.Router();
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const fs = require('fs');
const template = require('../lib/template.js')
const auth = require('../lib/auth');
const db = require('../lib/db');
const shortid = require('shortid');

//순서가 중요함. 예약어 처럼 사용한다.
router.get('/create',function(request,response){
  //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '', auth.statusUI(request,response));
    response.send(html);
  
  })
  
  router.post('/create',function(request,response){

 //로그인 상태가 아니면 튕겨내기
 if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  } 
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    db.get('topics').push({
      id:id,
      title:title,
      description:description,
      user_id:request.user.id
    }).write()
    response.redirect(`/topic/${id}`);
    // fs.writeFile(`data/${title}`,description, 'utf8',function(err){
    //   response.redirect(`/topic/${title}`);
    // });
    
  });
  
  router.get('/update/:pageId',function(request,response){
    //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
        auth.statusUI(request,response)
      );
      response.send(html);
    
  });
  })
  
  router.post('/update',function(request,response){
  /*
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.redirect(`/?id=${title}`);
        })
      });
  });
  */
  //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  
    fs.rename(`data/${id}`,`data/${title}`,function(error){
    fs.writeFile(`data/${title}`,description, 'utf8',function(err){
      response.redirect(`/topic/${title}`);
    })
    });
  
  })
  
  router.post('/delete',function(request,response){
    //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
    })
  
  })
  
  router.get('/:pageId',function(request,response,next){
  var topic = db.get('topics').find({id:request.params.pageId}).value();
   var user = db.get('users').find({
     id: topic.user_id
   }).value();
      var sanitizedTitle = sanitizeHtml(topic.title);
      var sanitizedDescription = sanitizeHtml(topic.description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>
        ${sanitizedDescription}
        <p>by ${user.displayName}</p>
        `,
        ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`,
          auth.statusUI(request,response)
      );
      response.send(html);
    
  });


module.exports = router;







