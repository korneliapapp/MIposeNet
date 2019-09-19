## MI poseNet
ml-posenet was downloaded from Clint's interactivity-master repository
posenet is a js library with built-in machine learning functionality that detects specific body parts or so-called "poses"

## Functions
*In this modified example*
- Computer vision detects the distance between shoulders of two different people and calculates the distance, taking the minimum of the two values (whichever two different shoulders are closer), and depending on the distance, the volume of the audio output that's been playing since the detection of two shoulders either decreases (when closer, distance lower), or increases (when farther apart, distance greater)
- When two shoulders are no longer in close proximity (<300), the audio pauses
- In addition to differences of shoulders, we more or less repeated the if statement but involved wrists as well. When the wrists come into contact (difference <50), a snare drum audio output plays


## Faceless Interaction 
- We changed the interface so that the camera stream is not displayed, the expression (input) is more obscured and complex with no immediate impression. We've selected surface-free modalities for both the input (expression) and the output (impression), since a strong sense of faceless interaction is defined mostly as an interaction without using any surface-bound modalities and using surface-free expressions & impressions
- Expression: Free gestures, targeting the shoulders and the wrists via posenet.js 
- Impression: Audio, ambient sounds, music 
- We're working with ambience and an atmosphere 
- We strived to make this interaction more ambient & ubiquitous as we removed the camera stream to enhance having invisible computational abilities & interfaces (If we display the camera stream it's easier to have a grasp on what's going on, more discreet) 
- Music provides ecological character, users are supposed to be immersed in this ecology that we've created and they dont necessarily have to perceive the screen as if they're interacting with it
- One-on-one interactions are abandoned here, users should not be actively engaging with the computer, but interacting with each other to cause "ripple-effect" outputs, we're moving in interactional forcefields and causing either minor or major perturbations
