module.exports = {
    isOwner : function(request,response){
        if(request.user){//passport를 설치하면 request객체는 user라는 값을 가진다
          return true;
        }else{
          return false;
        }
      },
      statusUI: function(request,response){
        var authStatusUI = '<a href="/auth/login">login</a>';
        if(this.isOwner(request,response)){
            console.log('nick: ',request.user.nickname);
          authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
      return authStatusUI;  
      }
}

