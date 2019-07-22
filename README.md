# P2P-Video-App

*For Video Conferencing and Messaging*

This is an app that allows you to communicate with other users directly online via video and messaging.

With this app, you can create/join a room that any other user can join. There is a maximum of 2 users allowed per room.

...

**Home Page**

<img src="/P2PVideoApp.PNG" title="home page" alt="home page" width="500px">



---


## Table of Contents 

> Sections
- [Sample Code](#Sample_Code)
- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [Team](#team)
- [FAQ](#faq)
- [Support](#support)
- [License](#license)


---

## Sample Code

```javascript
// code

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
```

---

## Installation


### Setup


>  install npm package

```shell
$ npm install
```

- For all of the packages used, refer to the package.json file [here](/package.json).

---

## Features
## Usage (Optional)
## Documentation (Optional)
## Tests (Optional)
## Contributing
## Team

> Contributors/People

| [**seansangh**](https://github.com/seansangh) |
| :---: |
| [![seansangh](https://avatars0.githubusercontent.com/u/45724640?v=3&s=200)](https://github.com/seansangh)    |
| [`github.com/seansangh`](https://github.com/seansangh) | 

-  GitHub user profile

---

## FAQ

- **Have any *specific* questions?**
    - Use the information provided under *Support* for answers

---

## Support

Reach out to me at one of the following places!

- Twitter at [`@wwinvestingllc`](https://twitter.com/wwinvestingllc?lang=en)
- Github at [`seansangh`](https://github.com/seansangh)

---

## Donations (Optional)

- If you appreciate the code provided herein, feel free to donate to the author via [Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url).

[<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppppcmcvdam.png" alt="Pay with PayPal, PayPal Credit or any major credit card" />](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url)

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a>S.S.</a>
