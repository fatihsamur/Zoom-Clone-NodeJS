const socket = io();
const videoGrid = document.getElementById('video-grid');

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000',
});

const myVideo = document.createElement('video');
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
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
