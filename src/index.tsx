import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Variables} from "./Types";

console.error("============LOADED index.tsx============");
console.error("BEFORE GLOBAL GAME ID: " + Variables.globalGameId);
if (Variables.globalGameId < 1) {
    createGame().then((newGame) => {
        Variables.globalGameId = newGame.chessGameEntity.id;
        console.log(newGame);
        console.error("NEW GLOBAL GAME ID: " + Variables.globalGameId);
    }).catch((error) => {
        console.log(error.message);
    })

}

function createGame() {
    let create = {
        "startColor": "BLACK",
        "playerOne": "FRONTEND",
        "colorPlayerOne": "WHITE",
        "playerTwo": "BACKEND",
        "colorPlayerTwo": "BLACK"
    }
    return fetch("http://localhost:8080/api/games/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(create)
    }).then((response) => {
        console.log(response);
        return response.json();
    }).catch((error) => {
        console.log(error.message);
        throw error;
    });
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
