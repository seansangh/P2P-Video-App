window.addEventListener('load', () => {
  
  // Chat platform
  const chatTemplate = Handlebars.compile($('#chat-template').html());
  const chatContentTemplate = Handlebars.compile($('#chat-content-template').html());
  const chatEl = $('#chat');
  const formEl = $('.form');
  const messages = [];
  let username;

  // Local Video
  const localImageEl = $('#iMm');
  const localVideoEl = $('#vid');

  // Remote Videos
  const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html());  
  const remoteVideosEl = $('#remote-videos');
  let remoteVideosCount = 0;

  // Hide cameras until they are initialized
  localVideoEl.hide();

  // Add validation rules to Create/Join Room Form
  formEl.form({
    fields: {
      t1: 'empty',
      t2: 'empty',
    },
  });

  // create our webrtc connection
  const webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'vid',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remote-videos',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false,
  });

  // We got access to local camera
  webrtc.on('localStream', () => {
    localImageEl.hide();
    localVideoEl.show();
  });

  // Remote video was added
  webrtc.on('videoAdded', (video, peer) => {
    // eslint-disable-next-line no-console
    const id = webrtc.getDomId(peer);
    const html = remoteVideoTemplate({ id });
    if (remoteVideosCount === 0) {
      remoteVideosEl.html(html);
    } else {
      remoteVideosEl.append(html);
    }
    $(`#${id}`).html(video);
    $(`#${id} video`).addClass('ui image medium'); // Make video element responsive
    remoteVideosCount += 1;
  });

  // Update Chat Messages
    const updateChatMessages = () => {
    const html = chatContentTemplate({ messages });
    const chatContentEl = $('#chat-content');
    chatContentEl.html(html);
    // automatically scroll downwards
    const scrollHeight = chatContentEl.prop('scrollHeight');
    chatContentEl.animate({ scrollTop: scrollHeight }, 'slow');
  };

  // Post Local Message
  const postMessage = (message) => {
    const chatMessage = {
      username,
      message,
      postedOn: new Date().toLocaleString('en-GB'),
    };
    // Send to all peers
    webrtc.sendToAll('chat', chatMessage);
    // Update messages locally
    messages.push(chatMessage);
    $('#post-message').val('');
    updateChatMessages();
  };

  // Display Chat Interface
  const showChatRoom = (room) => {
    formEl.hide();
    const html = chatTemplate({ room });
    chatEl.html(html);
    
    const postForm = $('form');
    postForm.form({
      message: 'empty',
    });
    $('#post-btn').on('click', () => {
      const message = $('#post-message').val();
      postMessage(message);
    });
    $('#post-message').on('keyup', (event) => {
      if (event.keyCode === 13) {
        const message = $('#post-message').val();
        postMessage(message);
      }
    });
  };

  // Register new Chat Room
  const createRoom = (roomName) => {
    // eslint-disable-next-line no-console
    console.info(`Creating new room: ${roomName}`);
    webrtc.createRoom(roomName, (err, name) => {
      formEl.form('clear');
      showChatRoom(name);
      postMessage(`${username} created chatroom`);
    });
  };

  // Join existing Chat Room
  const joinRoom = (roomName) => {
    // eslint-disable-next-line no-console
    console.log(`Joining Room: ${roomName}`);
    webrtc.joinRoom(roomName);
    showChatRoom(roomName);
    postMessage(`${username} joined chatroom`);
  };

  // Receive message from remote user
  webrtc.connection.on('message', (data) => {
    if (data.type === 'chat') {
      const message = data.payload;
      messages.push(message);
      updateChatMessages();
    }
  });
  
  
  
  
  
  
  
  if(document.getElementById('no').textContent != 0){
    username = document.getElementById('no3').textContent;
    const roomName = document.getElementById('no4').textContent;
    
    if(document.getElementById('no2').textContent == 'b2'){
     // $('body').css('color', 'red');
       createRoom(roomName);
    }
    else if(document.getElementById('no2').textContent == 'b3'){
       joinRoom(roomName);   
    }       
  }
  

  
  
  $('#send2').on('click', function(){
  var d= new Date();
  var hours=d.getHours(); if(hours<10){hours="0"+ hours;}
  var minutes=d.getMinutes(); if(minutes<10){minutes="0"+ minutes;}  
  var seconds=d.getSeconds(); if(seconds<10){seconds="0"+ seconds;}
  
  var date= d.toDateString()+', '+hours+":"+minutes+":"+seconds;
    
  var temp1= document.getElementById('my-message-template').innerHTML;
  var template= Handlebars.compile(temp1)
  
  var context= {name: document.getElementById('nom').innerHTML, date: date, message: document.getElementById('send').value}
  var html= template(context);

  document.getElementById('iM').innerHTML=document.getElementById('iM').innerHTML+html;  
  document.getElementById('send').innerHTML="";
    

  })
  
  //document.getElementById('so').innerHTML= parseInt(document.getElementById('so').innerHTML)+1;
  
  
  
 // Receive message from remote user

 
  
  
});
