const express = require('express');
const router = express.Router();
const template = require('../lib/template.js')
// app.get('/',(req,res)=> res.send('Hello World!!'));
router.get('/',function(request,response){
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/coding.jpg" style="width:400px; margin-top:10px; display:block">
      `,
      `<a href="/topic/create">create</a>`
    );
    response.send(html);

})

module.exports = router ;