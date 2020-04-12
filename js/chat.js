'strict';
/*jshint esversion: 8*/

class Chat {
    constructor(chatInput, chatLog) {
        this.chatInput = document.querySelector('.textChat input');
        this.chatLog = document.querySelector('.textLog');
        this.messages = [];
        this.refreshChat();
        setInterval( this.refreshChat(), 1000);
    }
    refreshChat() {
        if (Array.isArray(this.messages) && this.messages.length) {
            for (const message of this.messages) {
                let messageTemplate = `<p>[${message.timestamp}][ ${message.user} ] -> ${message.text}</p>`;
                this.chatLog.innerHTML += messageTemplate;
            }
            this.chatLog.scrollTop = this.chatLog.scrollHeight;
            this.messages = [];
        }
    }
    addToChat(username, event) {
        // dont add to 
        if (event && event.key != 'Enter') {
            return; // only run if the keypress is enter
        }
        else if (this.chatInput.value) {
            this.messages.push({
                'timestamp': (new Date()).toLocaleTimeString('en-US'),
                'user': username,
                'text': this.chatInput.value.toString()
            });
            this.chatInput.value = '';
            this.chatInput.required = false;
            this.refreshChat();
        }
        else {
            this.chatInput.required = true;
            setTimeout((() => {
                this.chatInput.required = false;
            }), 10000);
        }
    }
}
