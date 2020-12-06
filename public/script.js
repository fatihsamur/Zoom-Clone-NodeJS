const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;

const getMedia = async () => {
  const constraints = {
    video: true,
    audio: true,
  };
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    addVideoStream(myVideo, stream);
  } catch (err) {
    console.log(err);
  }
};

getMedia();

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};
