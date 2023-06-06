let globalGameId = 0;

export const Variables = {
    get globalGameId(): number {
        return globalGameId;
    },
    set globalGameId(value: number) {
        globalGameId = value;
    }
}

export enum PieceType {
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king',
}

export enum TeamType {
    OPPONENT = 'b',
    OUR = 'w',
}