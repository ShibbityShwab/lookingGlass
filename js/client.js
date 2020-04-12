'strict';
/*jshint esversion: 8*/

class Client {
    constructor(username) {
        this.username = (username) ? username : 'anon';
        this._screen = '';
        this._camera = '';
        this._audio = '';
        this.status = (navigator.onLine) ? 'ONLINE' : 'OFFLINE';
        setInterval((() => {
            this.status = (navigator.onLine) ? 'ONLINE' : 'OFFLINE';
        }), 1000);
    }
    get username() {
        return this._username;
    }
    get screen() {
        return this._screen;
    }
    get camera() {
        return this._camera;
    }
    get status() {
        return this._status;
    }
    set username(username) {
        this._username = username;
        document.querySelector('.dash .name .username').innerHTML = username;
    }
    set screen(screen) {
        this._screen = screen;
    }
    set camera(camera) {
        this._camera = camera;
        document.querySelector('.cameraShare video').srcObject = camera;
    }
    set status(status) {
        this._status = status;
        let elem = document.querySelector('.dash .name .status');

        elem.innerHTML = status;

        if ( status === 'ONLINE' ) {
            elem.style.color = 'greenyellow';
        } else {
            elem.style.color = 'red';
        }
    }

    usernamePrompt() {
        this.username = prompt('type in a username brau', this.username || 'dat name') || this.username;
    }

    stopMediaTracks(stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
    }
    async getScreen() {
        let captureStream = null;
        let displayMediaOptions = {
            video: {
                cursor: "always"
            },
            audio: false
        };
        try {
            captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            document.querySelector('.screenShare video').srcObject = captureStream;
            this.screen = captureStream;
            return captureStream;
        }
        catch (e) {
            console.error("Error: " + e);
        }
    }

    async getCamera() {
        let constraints = { video: true };
        if ( event ) {
            constraints = { video: { deivceId: { exact: event.target.value } } };
            if ( this.camera ) { this.stopMediaTracks(this.camera); }
        }
        
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.camera = stream;
            return stream;
        }
        catch (e) {
            console.error(e);
        }
    }

    async getAudio() {
        let constraints = { audio: true };
        if ( event ) {
            constraints = { audio: { deivceId: { exact: event.target.value } } };
            if ( this.audio ) { this.stopMediaTracks(this.audio); }
        }
        
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.audio = stream;
            return stream;
        }
        catch (e) {
            console.error(e);
        }
    }
    
    // enumerate devices
    async getDevices( filter ) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
            return;
        }
        // List cameras and microphones.
        let devices = await navigator.mediaDevices.enumerateDevices();

        let select = document.querySelector('.cameraShare select');
        select.innerHTML = '<option></option>';
        
        if ( filter == 'video' ) {
            filter = /videoinput/g;
        } else if ( deviceType == 'audio' ){
            filter = /audioinput/g;
        }

        for (const [ index, device ] of devices.entries()) {
            let checkedLabel = (device.label.length > 0 ) ? device.label : 'Device ' + index;
            let templateString = `<option value="${device.deviceId}">${checkedLabel}</option>`;
            try {
                if (device.kind.match(filter)) {
                    select.innerHTML += templateString;
                }
                console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
            }
            catch (e) {
                console.log(e.name + ": " + e.message);
            }
        }
    }
}
