var express = require('express');
var router = express.Router();

const messages = [
  {
    text:'hello ',
    user:"Chris",
    added: new Date()
  },
  {
    text:"yo yo yo",
    user:"Boconut",
    added: new Date() 
  }
]


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Messageboard', messages: messages });
});

router.post('/', function(req, res, next) {

  res.redirect("/new");  //send back to index

});


router.post('/new', function(req, res, next) {
  let messageText = req.body.messageText;
  let messageUser = req.body.messageUser;
  messages.push( {text:messageText, user:messageUser, added: new Date()});
  res.redirect("/");  //send back to index

});

module.exports = router;
