const socket = io();
const videoGrid = document.getElementById('video-grid');

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000',
});

const myVideo = document.createElement('video');

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      console.log('user connected');
      setTimeout(() => {
        connectToNewUser(userId, stream);
        console.log('ahan yeni connected');
      }, 1000);
    });
  });

peer.on('open', (id) => {
  socket.emit('join-room', room_id, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};

const msg = document.getElementById('chat_message');

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && msg.value !== '') {
    socket.emit('message', msg.value);
    msg.value = '';
  }
});

socket.on('createMessage', (message) => {
  const msgList = document.getElementById('msg_list');
  const listItem = document.createElement('li');
  listItem.classList.add('msg_list');
  listItem.innerHTML = ` <p class="message" > User: ${message} </> <p/>  `;

  msgList.appendChild(listItem);
});

const muteBtn = document.getElementById('mute_btn');

// mute audio
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

muteBtn.addEventListener('click', () => {
  muteUnmute();
});

const setUnmuteButton = () => {
  const html = `
  <i class="red-text fas fa-microphone-slash"></i>
  <span class="red-text" > Unmute </span>
  `;
  muteBtn.innerHTML = html;
};

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span> Mute </span>
  `;
  muteBtn.innerHTML = html;
};

// stop video

const stopStartVideo = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setStopVideoButton();
  } else {
    setStartVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const stopVideoBtn = document.getElementById('stop_video_btn');

stopVideoBtn.addEventListener('click', () => {
  stopStartVideo();
});

const setStopVideoButton = () => {
  const html = `
  <i class="red-text fas fa-video-slash"></i>
  <span class="red-text" > Start Video </span>
  `;
  stopVideoBtn.innerHTML = html;
};

const setStartVideoButton = () => {
  const html = `
  <i class="fas fa-video"></i>
  <span> Stop Video </span>
  `;
  stopVideoBtn.innerHTML = html;
};
