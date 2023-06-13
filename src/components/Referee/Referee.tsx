import {useRef, useState} from "react";
import {initialBoard} from "../../Constants";
import {Piece, Position} from "../../models";
import {Board} from "../../models/Board";
import {Pawn} from "../../models/Pawn";
import {bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove} from "../../referee/rules";
import {PieceType, TeamType, Variables} from "../../Types";
import Chessboard from "../Chessboard/Chessboard";

var stompClient: any = null;
export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);


    /*let Sock = new SockJS("http://localhost:8080/websocket");
    stompClient = over(Sock);
    // @ts-ignore
    stompClient.connect({}, onConnected, onError);


    const onConnected = () => {
        stompClient.subscribe("/topic/chess", onMessageReceived);
        stompClient.subscribe("/topic/greetings", onMessageReceived);
        socketLoaded();
    }

    const socketLoaded = () => {
        stompClient.send("/app/hello", {}, "HELLO FROM FRONTEND");
    }

    const onMessageReceived = (payload: string) => {
        console.log("MESSAGE RECEIVED: " + payload);
    }

    const onError = ({err}: { err: any }) => {
        console.log(err);
    }

     */

    let test: any[] = [];
    console.error("REFEREE WITH GLOBAL GAME ID: " + Variables.globalGameId)

    function playMove(playedPiece: Piece, destination: Position): boolean {
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

        let whoIsPlaying;
        if(playedPiece.team == TeamType.OUR) {
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
        });
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

            <p style={{ color: "black", fontSize: "24px", textAlign: "center" }}>Total turns: {board.totalTurns-1}</p>
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