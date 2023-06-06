import React, { useRef, useState } from "react";

export default function Chessboard() {
    const [selectedGameId, setSelectedGameId] = useState("");
    const [gameProperties, setGameProperties] = useState<[]>([]);

    let testdata = [];
    const handleGameIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGameId(event.target.value);
    };

    const fetchGameProperties = () => {
        console.log("fetch --> http://localhost:8080/api/games/" + selectedGameId);
        fetch("http://localhost:8080/api/games/" + selectedGameId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if(!response.ok) {
                    throw new Error("Fehler beim Abrufen der Game-Eigenschaften! HTTP-Statuscode: " + response.status);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setGameProperties(data);
                testdata = data;
            })
            .catch((error) => {
                console.error("Fehler beim Abrufen der Game-Eigenschaften:", error);
                console.log("Response: " + error.message)
            });
    };

    let div = <>
        <div>
            <h1>Game Details Page</h1>
            <label htmlFor="gameIdInput">Chess Game ID:</label>
            <input
                type="text"
                id="gameIdInput"
                value={selectedGameId}
                onChange={handleGameIdChange}
            />
            <button onClick={fetchGameProperties}>Anzeigen</button>

            <div>
                <h2>Game Details</h2>
                <p>Game ID: {}</p>
                <p>Game State: {}</p>
                <p>Players: {}</p>
                {/* Weitere Eigenschaften anzeigen */}
            </div>

        </div>
    </>;
    return div;
}

//https://github.com/matteoklee/hybrid_chess_frontend.git