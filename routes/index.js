const express = require('express');
const router = express.Router();
const template = require('../lib/template.js')
// app.get('/',(req,res)=> res.send('Hello World!!'));
const auth = require('../lib/auth.js');

router.get('/',function(request,response){
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<div style="color:blue">${feedback}</div>
      <h2>${title}</h2>${description}
      <img src="/images/coding.jpg" style="width:400px; margin-top:10px; display:block">
      `,
      `<a href="/topic/create">create</a>`,
      auth.statusUI(request,response)
    );
    response.send(html);

})

module.exports = router ;