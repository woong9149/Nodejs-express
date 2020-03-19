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
    var topic = db.get('topics').find({id:request.params.pageId}).value();
    if(topic.user_id !==request.user.id){
      request.flash('error', 'Not yours');
      return response.redirect('/');
    }
      var title = topic.title;
      var description = topic.description;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update" method="post">
          <input type="hidden" name="id" value="${topic.id}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
        auth.statusUI(request,response)
      );
      response.send(html);
    
  })
  
  router.post('/update',function(request,response){

  //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  var topic = db.get('topics').find({id:id}).value();
  if(topic.user_id !==request.user.id){
    request.flash('error', 'Not yours');
    return response.redirect('/');
  }
  
  db.get('topics').find({id:id}).assign({
    title:title, description:description
  }).write();
  response.redirect(`/topic/${topic.id}`);
  
  })
  
  router.post('/delete',function(request,response){
    //로그인 상태가 아니면 튕겨내기
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
    var post = request.body;
    var id = post.id;
    var topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
      request.flash('error','Not yours!');
      return response.redirect('/');
    }
    db.get('topics').remove({id:id}).write();
    response.redirect('/');
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
          <a href="/topic/update/${topic.id}">update</a>
          <form action="/topic/delete" method="post">
            <input type="hidden" name="id" value="${topic.id}">
            <input type="submit" value="delete">
          </form>`,
          auth.statusUI(request,response)
      );
      response.send(html);
    
  });


module.exports = router;







