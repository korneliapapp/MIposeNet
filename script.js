// @ts-nocheck
const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const resultsEl = document.getElementById('results');
const poseColours = [];

var audio = new Audio('sound.mp3')


/*document.getElementById('btnFreeze').addEventListener('click', evt => {
  if (cameraEl.paused) {
    cameraEl.play();
  } else {
    cameraEl.pause();
  }
});*/

console.log('Loading posenet model')

// See docs for info on these parameters
// https://github.com/tensorflow/tfjs-models/tree/master/posenet
let model = null;
posenet.load({
  architecture: 'ResNet50',
  outputStride: 32,
  inputResolution: 257,
  quantBytes: 4
}).then(m => {
  model = m;
  console.log('Model loaded, starting camera');
  startCamera();
})



cameraEl.addEventListener('play', () => {
  // Resize canvas to match camera frame sie
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;

  // Start processing!
  window.requestAnimationFrame(process);
});

// Processes the last frame from camera
function process() {
  model.estimateMultiplePoses(canvasEl, {
    flipHorizontal: false,
    maxDetections: 5, /* max # poses */
    scoreThreshold: 0.5,
    nmsRadius: 20
  }).then(processPoses); /* call processPoses with result */
}

function processPoses(poses) {
  // For debug purposes, draw points
  drawPoses(poses);

/*
  // Demo of using position:
  //  Calculates a 'slouch factor' - difference in Y between left/right shoulders
  if (poses.length == 1 && poses[0].score > 0.3) {
    const leftShoulder = getKeypointPos(poses, 'leftShoulder');
    const rightShoulder = getKeypointPos(poses, 'rightShoulder');
    if (leftShoulder != null && rightShoulder != null) {
      const slouchFactor = Math.floor(Math.abs(leftShoulder.y - rightShoulder.y));
      //console.log(poses.length);
      var c = canvasEl.getContext('2d');
      c.fillStyle = 'black';
      c.fillText('Slouch factor: ' + slouchFactor, 100, 10);
    }
  }
*/


//Using shoulder positions between two people (precisely the left shoulder of the person one and right shoulder of person two)
//when the difference of the shoulder distance lowers down to less than 100, an audio output plays 
//Try adding it up to 5 people??? 
if(poses.length == 2 && poses[0].score > 0.3){
  

  //getting keypoints for left & right shoulder of two objects
  const leftShoulderx = getKeypointPos(poses, 'leftShoulder', 0);
  const rightShoulderx = getKeypointPos(poses, 'rightShoulder', 0);

  const leftShouldery = getKeypointPos(poses, 'leftShoulder', 1);
  const rightShouldery = getKeypointPos(poses, 'rightShoulder', 1);


  
    const shoulderDiff1 = Math.floor(Math.abs(leftShouldery.x - rightShoulderx.x));
    const shoulderDiff2 = Math.floor(Math.abs(leftShoulderx.x - rightShouldery.x));

    if (shoulderDiff1 < 800 || shoulderDiff2 < 800){
      audio.play();
      audio.volume = 1.0;
      console.log("It works! 100% Volume");
    }

    if (shoulderDiff1 < 400 || shoulderDiff2 < 400){
      audio.play();
      audio.volume = 0.5;
      console.log("It works! 50% Volume");
    }

    if (shoulderDiff1 < 90 || shoulderDiff2 < 90){
      audio.play();
      audio.volume = 0.0;
      console.log("It works! NO Volume");
    }
    
    //mostly to check if it's working
    var c = canvasEl.getContext('2d');
    c.fillStyle = 'black';
    c.fillText('Shoulder Difference 1: ' + shoulderDiff1 + 'Shoulder Difference 2:' + shoulderDiff2 , 100, 10);
  
}

  // Repeat, if not paused
  if (cameraEl.paused) {
    console.log('Paused processing');
    return;
  }
  window.requestAnimationFrame(process);
}

// Helper function to get a named keypoint position
function getKeypointPos(poses, name, poseIndex) {
  // Don't return a value if overall score is low
  if (poses.score < 0.3) return null;
  if (poses.length < poseIndex) return null;

  const kp = poses[poseIndex].keypoints.find(kp => kp.part == name);
  if (kp == null) return null;
  return kp.position;
}

function drawPoses(poses) {
  // Draw frame to canvas
  var c = canvasEl.getContext('2d');
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth, cameraEl.videoHeight);

  // Fade out image
  c.fillStyle = 'rgba(255,255,255,0.7)';
  c.fillRect(0, 0, cameraEl.videoWidth, cameraEl.videoHeight);

  // Draw each detected pose
  for (var i = 0; i < poses.length; i++) {
    drawPose(i, poses[i], c);
  }

  // If there's no poses, draw a warning
  if (poses.length == 0) {
    c.textBaseline = 'top';
    c.fillStyle = 'red';
    c.fillText('No poses detected', 10, 10);
  }
}

// Draws debug info for each detected pose
function drawPose(index, pose, c) {
  // Lookup or generate random colour for this pose index
  if (!poseColours[index]) poseColours[index] = getRandomColor();
  const colour = poseColours[index];

  // Draw prediction info
  c.textBaseline = 'top';
  c.fillStyle = colour;
  c.fillText(Math.floor(pose.score * 100) + '%', 10, (index * 20) + 10);

  // Draw each pose part
  pose.keypoints.forEach(kp => {
    // Draw a dot for each keypoint
    c.beginPath();
    c.arc(kp.position.x, kp.position.y, 5, 0, 2 * Math.PI);
    c.fill();

    // Draw the keypoint's score (not very useful)
    //c.fillText(Math.floor(kp.score * 100) + '%', kp.position.x + 7, kp.position.y - 3);

    // Draw name of keypoint
    c.fillText(kp.part, kp.position.x - 3, kp.position.y + 6);
  });
}

// ------------------------
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Reports outcome of trying to get the camera ready
function cameraReady(err) {
  if (err) {
    console.log('Camera not ready: ' + err);
    return;
  }
  console.log('Camera ready');
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function startCamera() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (!navigator.getUserMedia) {
    cameraReady('getUserMedia not supported');
    return;
  }
  navigator.getUserMedia({ video: { width: 640, height: 480 }, audio: false },
    (stream) => {
      try {
        cameraEl.srcObject = stream;
      } catch (error) {
        cameraEl.srcObject = window.URL.createObjectURL(stream);
      }
      cameraReady();
    },
    (error) => {
      cameraReady(error);
    });
}
