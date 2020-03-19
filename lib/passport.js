const db = require('../lib/db');
const bcrypt = require('bcrypt');

module.exports = function(app){

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
  done(null, user.id);//두번째인자는 사용자의 식별자
});

passport.deserializeUser(function(id,done){//로그인 후 페이지 방문할때마다 호출됨. id값으로 사용자의 데이터를 가져옴.
  var user = db.get('users').find({id:id}).value();
  console.log('deserializeUser: ', id, user);
  done(null, user);
})

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done){
    console.log('LocalStrategy: ', email+', '+password);
    var user = db.get('users').find({
          email : email
    }).value();
    if(user){
      console.log('password:',password,'user.password:',user.password);
      bcrypt.compare(password,user.password,function(err,result){
        console.log('result: ',result);
        console.log('user: ',user,'user.password: ',user.password);
        console.log('password2:',password,'user.password2:',user.password);
        if(result){
          return done(null,user,{
            message: 'Welcome.'
          })
        }else{
         
          return done(null,false,{
            message: 'Password is Wrong'
          })
        }
      })
      
    }else{
      return done(null,false,{
        message: 'Email is Wrong'
      })
    }
  }
))
return passport;
}
