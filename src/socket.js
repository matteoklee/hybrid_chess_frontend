import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {Variables} from "./Types";
import {Referee, board} from "./components/Referee/Referee";

class SocketManager {
    constructor() {
        /*
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
                /*
            });

            this.stompClient.subscribe('/topic/chess', (message) => {
                console.error("----------------------------------------------------------");
                console.log('Nachricht erhalten: ' + message);
                this.stompClient.send('/app/chessInfo', {}, "WORKS");

                fetch('http://localhost:8080/api/games/' + Variables.globalGameId, {
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
                console.log(board);
                //playMove();
                /*
                 const chessboard = chessboardRef.current;
                    if (activePiece && chessboard) {
                      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
                      const y = Math.abs(
                        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
                      );

                      const currentPiece = pieces.find((p) =>
                        p.samePosition(grabPosition)
                      );
                      console.log(grabPosition);

                      if (currentPiece) {
                        var succes = playMove(currentPiece.clone(), new Position(x, y));

                        if(!succes) {
                          //RESETS THE PIECE POSITION
                          activePiece.style.position = "relative";
                          activePiece.style.removeProperty("top");
                          activePiece.style.removeProperty("left");
                        }
                      }
                      setActivePiece(null);
                    }
                 */
                /*
                console.log("----------------------------------------------------------");
            });

            this.stompClient.send('/app/hello', {}, JSON.stringify({ name: 'Alice' }));
            this.stompClient.send('/app/chess', {}, "FRONTEND TO CHESS BACKEND");
        });*/
    }

}

export default SocketManager;
