import React, { useState } from "react";

export default function GameDetailsPage() {
    const [selectedGameId, setSelectedGameId] = useState("");
    const [gameProperties, setGameProperties] = useState<[]>([]);

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
                console.log("Data:")
                console.log(data);
                setGameProperties(data);

            })
            .catch((error) => {
                console.error("Fehler beim Abrufen der Game-Eigenschaften:", error);
                console.log("Response: " + error.message)
            });
    };

    //let fetchedData = Object.entries((testdata : any[]) => {});
    console.log("DEBUG Testdata");
    let testdata = null;
    if(gameProperties.length > 0) {
        testdata = Object.entries(gameProperties);
    }
    console.log(testdata);

    let divClass ="black";
    let div = <>
        <div className="content" style={{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
            <h1 className="title is-4">Game Archiv</h1>

            <div className="field">
                <label className="label" htmlFor="gameIdInput">Chess Game ID:</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        id="gameIdInput"
                        value={selectedGameId}
                        onChange={handleGameIdChange}
                        placeholder="34"
                    />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-link" onClick={fetchGameProperties}>Anzeigen</button>
                </div>
            </div>

            <div className="content">
                <h2 className="subtitle">Game Details</h2>
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