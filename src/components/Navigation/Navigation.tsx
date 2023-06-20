import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GameDetailsPage from "../GameDetails/GameDetailsPage";
import Referee from "../Referee/Referee";
import Home from "../Home/Home";
import Impressum from "../impressum/Impressum"

//npm install react-router-dom@6
export default function Navigation() {

    return (
        <Router>
            <div>
                <nav style={{textAlign: "center",  marginLeft: "auto", marginRight: "auto"}}>
                    <ul style={{display: "flex", listStyleType: "none", marginLeft: "auto", marginRight: "auto"}}>
                        <li style={{ marginRight: "12px"}}>
                            <Link to="/">Home</Link>
                        </li>
                        <li style={{ marginRight: "12px"}}>
                            <Link to="/chess">Game</Link>
                        </li>
                        <li style={{ marginRight: "12px"}}>
                            <Link to="/game-details">Game Archiv</Link>
                        </li>
                        <li style={{ marginRight: "12px"}}>
                            <Link to="/impressum">Impressum</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>

                    <Route path="/game-details">
                        <GameDetailsPage />
                    </Route>
                    <Route path="/chess">
                        <Referee/>
                    </Route>
                    <Route path="/impressum">
                        <Impressum/>
                    </Route>
                    <Route path="">
                        <Home/>
                    </Route>
                    {/* Weitere Routen für andere Seiten */}
                </Switch>
            </div>
        </Router>
    );
}


