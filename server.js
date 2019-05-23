const express = require('express');
const app = express();
const bodyParser= require('body-parser');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const port = 3000;

const handlebars= require('handlebars');

var http= require('http')
var server=require('http').Server(app);
var io= require('socket.io')(server);
var userCount=0; var obj={}; var redirect=[];

// Set public folder as root
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})) //handle url encoded data, parsed as req.body

// Provide access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
//app.use((req, res) => res.sendFile(`${__dirname}/views/index.html`));


io.on('connection', function(socket){
  var myRoom;
  
  socket.on('room', function(data){
    myRoom= data.name;
    var room= io.sockets.adapter.rooms[myRoom];
    
    if(room == undefined){
      socket.join(data.name);    
      io.to(myRoom).emit('plus', '1');
    }
    else{
      if(room.length>=2){
        socket.join('leave');    
        io.to('leave').emit('leave', 'me'); 
      }
      else{
        socket.join(data.name);    
        io.to(myRoom).emit('plus', room.length);        
      }
    }    
  })
  
  socket.on('lines', function(data){
    io.to(data.name).emit('lines', data.value)
  })
  
  socket.on('minus', function(data){
    io.to(data.name).emit('minus', parseInt(data.value)-1)
  })
  
  socket.on('disconnect', function(data){
    var room= io.sockets.adapter.rooms[myRoom];
    if(room == undefined){
      io.to(myRoom).emit('minus', 0);
    }
    else{
      io.to(myRoom).emit('minus', room.length);
    }
    
    socket.leave(myRoom);
    socket.disconnect();
  })
  
  
})

app.get('/', function(request, response) {  
  response.render(__dirname+ '/views/intro.html')
 // response.redirect('accept')
});

app.get('/accept', function(request, response) {  
  if(request.query.message){var message= request.query.message;}
  else{var message=""}
    //console.log(request.query.message);
  
  response.render(__dirname+ '/views/index.html', {p1:'', p2:'', bt:'', redirect:'', count:'', message: message})
});

app.get('/decline', function(request, response) {
  
  response.render(__dirname+ '/views/decline.html')
});

app.post('/accept', function(request,response){
  var room= request.body.t2.toLowerCase();  
  response.redirect('/room?t1='+request.body.t1+'&t2='+room+'&bt='+request.body.b2+'&c=1')
  //response.render(__dirname+ '/views/index.html', {p1: request.query.t1, p2:request.query.t2, bt: request.query.b2, redirect: '', count:0})
});

app.get('/room', function(request,response){  
   response.render(__dirname+ '/views/index.html', {p1: request.query.t1, p2:request.query.t2, bt: request.query.bt, redirect: redirect, count:1, message:''})

});
  

server.listen(process.env.PORT || '3000', function () {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000');
});
