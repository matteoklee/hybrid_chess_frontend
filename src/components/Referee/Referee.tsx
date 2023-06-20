import {useRef, useState} from "react";
import {initialBoard} from "../../Constants";
import {Piece, Position} from "../../models";
import {Board} from "../../models/Board";
import {Pawn} from "../../models/Pawn";
import {bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove} from "../../referee/rules";
import {PieceType, TeamType, Variables} from "../../Types";
import Chessboard from "../Chessboard/Chessboard";
// @ts-ignore
import SockJS from 'sockjs-client';
// @ts-ignore
import Stomp from 'stompjs';

export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    let test: any[] = [];
    console.error("REFEREE WITH GLOBAL GAME ID: " + Variables.globalGameId)

    console.log("=============SOCKET.JS=============")

    const socket = new SockJS('http://localhost:8080/websocket');
    let stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame: string) => {
        console.log('Verbindung hergestellt: ' + frame);

        stompClient.subscribe('/topic/chess', (message: string) => {
            console.error("----------------------------------------------------------");
            console.log('Nachricht erhalten: ' + message);
            //stompClient.send('/app/chessInfo', {}, "WORKS");

            fetch('http://localhost:8080/api/moves/' + Variables.globalGameId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }//, body: JSON.stringify({ message: message.content })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('API-Antwort erhalten:', data);
                    console.log('API-Antwort SIZE:', data.length);
                    console.log('API-Antwort Object:', data[data.length-1]);
                    // @ts-ignore
                    console.log('API-Antwort newPos:', Object.entries(data)[data.length-1][1].newPos);
                    // @ts-ignore
                    console.log('API-Antwort previousPos:', Object.entries(data)[data.length-1][1].previousPos);
                    // @ts-ignore
                    console.log('API-Antwort previousPos:', Object.entries(data)[data.length-1][1].previousPos.x);
                    //moveFromBackend = data[data.length-1];
                    let moveFromBackend = Object.entries(data)[data.length-1][1];

                    const testpiece = board.pieces.find((p) =>
                        //p.samePosition(new Position(5, 6))
                        // @ts-ignore
                        p.samePosition(new Position(moveFromBackend.previousPos.x, 7-moveFromBackend.previousPos.y)) //5 6
                    );
                    if (testpiece instanceof Piece) {
                        // @ts-ignore
                        playMove(testpiece, new Position(moveFromBackend.newPos.x, 7-moveFromBackend.newPos.y), false); //5 4
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Aufrufen der API:', error);
                });
            console.log(board);

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
            console.log("----------------------------------------------------------");
        });

        //stompClient.send('/app/hello', {}, JSON.stringify({ name: 'Alice' }));
        //stompClient.send('/app/chess', {}, "FRONTEND TO CHESS BACKEND");
    });


    function playMove(playedPiece: Piece, destination: Position, fromFrontend: boolean): boolean {
        console.error("PLAYED MOVE: " + JSON.stringify(playedPiece));
        console.error("PLAYED MOVE: " + JSON.stringify(destination));
        console.error("PLAYED MOVE: " + fromFrontend);

        // If the playing piece doesn't have any moves return
        if (playedPiece.possibleMoves === undefined) return false;

        // Prevent the inactive team from playing
        if (playedPiece.team === TeamType.OUR
            && board.totalTurns % 2 !== 1) return false;
        if (playedPiece.team === TeamType.OPPONENT
            && board.totalTurns % 2 !== 0) return false;

        let playedMoveIsValid = false;

        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if (!validMove) return false;

        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        // playMove modifies the board thus we
        // need to call setBoard
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            // Playing the move
            playedMoveIsValid = clonedBoard.playMove(enPassantMove,
                validMove, playedPiece,
                destination);

            if(clonedBoard.winningTeam !== undefined) {
                console.log("========================================");
                console.log("WINNING TEAM: " + clonedBoard.winningTeam);
                console.log("========================================");
                checkmateModalRef.current?.classList.remove("hidden");
            }

            return clonedBoard;
        })

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }
        /**
         * Parameter:
         * {
         *     "id" : 2,
         *     "whoIsPlaying" : {
         *         "name": "One"
         *       },
         *       "move" : {
         *         "previousPos": {
         *           "x": 4,
         *           "y": 6
         *         },
         *         "newPos": {
         *           "x": 4,
         *           "y": 3
         *         }
         *       }
         * }
         * @param chessGameId
         * @param updateGameModel
         * @return
         */


        if(fromFrontend) {
            let whoIsPlaying;
            if(playedPiece.team === TeamType.OUR) {
                whoIsPlaying = false;
            } else whoIsPlaying = true;

            let data = {
                "id" : Variables.globalGameId,
                "whoIsPlaying" : {
                    "name": (whoIsPlaying) ? "BACKEND" : "FRONTEND"
                },
                "move" : {
                    "previousPos": {
                        "x": playedPiece.position.x,
                        "y": 7-playedPiece.position.y
                    },
                    "newPos": {
                        "x": destination.x,
                        "y": 7-destination.y
                    }
                }
            }
            console.log("MOVE TEST: " + JSON.stringify(data));
            let testerror = false;

            fetch("http://localhost:8080/api/games/" + Variables.globalGameId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error.message);
                testerror = true;
            });
            if(testerror) {
                console.log("Error playMove")
                return false;
            }
        }

        return playedMoveIsValid;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board.pieces.find(
                    (p) =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn &&
                        (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }

    //TODO
    //Add stalemate!
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
        }

        return validMove;
    }

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType,
                        piece.team, true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();

            return clonedBoard;
        })

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }
    
    function restartGame() {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    return (
        <>

            <p style={{ color: "black", fontSize: "24px", textAlign: "center", margin: "0px", padding: "0px", marginBottom: "10px"}}>Spielzüge: {board.totalTurns-1}</p>
            <div className="modal hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <div className="modal hidden" ref={checkmateModalRef}>
                <div className="modal-body">
                    <div className="checkmate-body">
                        <span>The winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}!</span>
                        <button onClick={restartGame}>Play again</button>
                    </div>
                </div>
            </div>
            <Chessboard playMove={playMove}
                pieces={board.pieces} />
            <p style={{ color: "white", fontSize: "24px", textAlign: "center" }}>{test}</p>
        </>
    )
}
//     <!- <p style={{ color: "white", fontSize: "36px", textAlign: "center", paddingBottom: "0px", marginBottom: "0px" }}>Hybrid_Chess</p> -->