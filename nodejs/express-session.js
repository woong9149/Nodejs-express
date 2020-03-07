var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
  
var app = express()
var FileStore = require('session-file-store')(session);

app.use(session({
  secret: 'keyboard cat',//타인에게 노출되면안됨. 버전관리를 한다면 소스코드에 포함시키면안되며 실서버에 올리때는 변수처리 등을 해서 올려야함.
  resave: false,//false이면 세션 데이터가 변경되기 전에는 세션 저장소에 값을 저장하지 않는다.
  saveUninitialized: true, //세션이 필요할때까지는 세션을 구동하지 않는다
  store:new FileStore()
}))
 
/*
    app.use(function (req, res, next) {
        if (!req.session.views) {
        req.session.views = {}
        }
  // get the url pathname
  var pathname = parseurl(req).pathname
  
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  
  next()
})
  
app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})
  */
app.get('/', function (req, res, next) {
    if(req.session.num === undefined){
        req.session.num = 1;
    }else{
        req.session.num = req.session.num+1;
    }
  res.send(`Views : ${req.session.num} `);
})
 
app.listen(3000, function(){
    console.log('3000!');
});