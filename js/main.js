'strict';
/*jshint esversion: 8*/

// use fullscreen view
async function toggleFullscreen(event) {
	event.target.requestFullscreen();
}

async function cameraAccessHandler(event) {
    await user.getCamera(event);
    await user.getDevices('video');
    document.querySelector('.dash .cameraButton').hidden = true;
    document.querySelector('.dash .cameraList').hidden = false;
}