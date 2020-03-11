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
        return done(null,authData,{
          message: 'Welcome.'
        });
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
}
))
return passport;
}
