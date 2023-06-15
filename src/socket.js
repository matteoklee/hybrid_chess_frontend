import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class SocketManager {
    constructor() {
        console.log("=============SOCKET.JS=============")

        const socket = new SockJS('http://localhost:8080/websocket');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, (frame) => {
            console.log('Verbindung hergestellt: ' + frame);

            this.stompClient.subscribe('/topic/greetings', (greeting) => {
                var message = JSON.parse(greeting.body);
                console.log('Nachricht erhalten: ' + message.content);


                /*fetch('/api/some-endpoint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: message.content })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('API-Antwort erhalten:', data);
                    })
                    .catch(error => {
                        console.error('Fehler beim Aufrufen der API:', error);
                    });

                 */
            });

            this.stompClient.subscribe('/topic/chess', (message) => {
                console.error("----------------------------------------------------------");
                console.log('Nachricht erhalten: ' + message);
                this.stompClient.send('/app/chessInfo', {}, "WORKS");

                fetch('http://localhost:8080/api/games/34', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }//, body: JSON.stringify({ message: message.content })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('API-Antwort erhalten:', data);
                    })
                    .catch(error => {
                        console.error('Fehler beim Aufrufen der API:', error);
                    });
                console.log("----------------------------------------------------------");
            });

            this.stompClient.send('/app/hello', {}, JSON.stringify({ name: 'Alice' }));
            this.stompClient.send('/app/chess', {}, "FRONTEND TO CHESS BACKEND");
        });
    }

}

export default SocketManager;
