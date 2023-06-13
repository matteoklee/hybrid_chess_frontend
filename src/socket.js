import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class SocketManager {
    constructor() {
        console.log("=============SOCKET.JS=============")

        const socket = new SockJS('http://localhost:8080/websocket');
        this.stompClient = Stomp.over(socket);

        // Verbindung herstellen
        this.stompClient.connect({}, (frame) => {
            console.log('Verbindung hergestellt: ' + frame);

            // Subscriben auf den Endpunkt für die ausgehenden Nachrichten
            this.stompClient.subscribe('/topic/greetings', (greeting) => {
                var message = JSON.parse(greeting.body);
                console.log('Nachricht erhalten: ' + message.content);

                // REST-API-Schnittstelle aufrufen
                // Beispiel mit fetch()
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
                        // Weitere Aktionen mit der API-Antwort durchführen
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
                // REST-API-Schnittstelle aufrufen
                // Beispiel mit fetch()
                fetch('http://localhost:8080/api/games/34', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }//, body: JSON.stringify({ message: message.content })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('API-Antwort erhalten:', data);
                        // Weitere Aktionen mit der API-Antwort durchführen
                    })
                    .catch(error => {
                        console.error('Fehler beim Aufrufen der API:', error);
                    });
                console.log("----------------------------------------------------------");
            });

            // Nachricht senden
            this.stompClient.send('/app/hello', {}, JSON.stringify({ name: 'Alice' }));
            this.stompClient.send('/app/chess', {}, "FRONTEND TO CHESS BACKEND");
        });
    }

    // Weitere Methoden und Funktionen der Klasse

}

export default SocketManager;
