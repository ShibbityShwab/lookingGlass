'strict';
/*jshint esversion: 8*/
class Peers { 
    constructor(){
        this._connections = [];
        this.room = Math.random().toString(36).substring(2, 15);
        this.userPanel = document.querySelector('.users');
        this.userTemplate = document.querySelector('#peer-dash');
    }

    get connections() {
        return this._connections;
    }
    get room() {
        return this._room;
    }
    set room( room ) {
        this._room = room;
        document.querySelector('.channelID').innerHTML = `Current Room: ${this.room}`;
    }
    
    roomPrompt() {
        this.room = prompt('What room are you looking to join?', this.room) || this.room;
    }
    
    addConnection() {
        let connection = {
            'id': 'U' + Math.random().toString(36).substring(2, 15),
            'username': 'anon',
            'status': 'ONLINE'
        };
        this.connections.push(connection);
        let renderedTemplate = this.userTemplate.innerHTML;
        console.log(renderedTemplate);
        renderedTemplate = renderedTemplate.replace(/_ID_/g, connection.id);
        renderedTemplate = renderedTemplate.replace(/_USERNAME_/g, connection.username);
        renderedTemplate = renderedTemplate.replace(/_STATUS_/g, connection.status);
        console.log(renderedTemplate);
        this.userPanel.innerHTML += renderedTemplate;
    }

    removeConnection( id ) {
        for ( let i = 0; i < this.connections.length; i++) {
            console.log(this.connections[i]);
            if ( this.connections[i].id == id ) {
                console.log(`#${this.connections[i].id}`);
                document.querySelector(`#${this.connections[i].id}`).remove();
                this.connections.splice(i, 1);
            }
        }
    }
}