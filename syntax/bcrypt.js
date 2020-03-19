var bcrypt = require('bcrypt');
const saltRound = 10;
const myPlaintextPassword = '111111';
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword,saltRound,function(err,hash){
    console.log('hash: ',hash);
    bcrypt.compare(myPlaintextPassword,hash,function(err,result){
        console.log('my pwd: ',result);
    })
    bcrypt.compare(someOtherPlaintextPassword,hash,function(err,result){
        console.log('other pwd: ',result);
    })
})