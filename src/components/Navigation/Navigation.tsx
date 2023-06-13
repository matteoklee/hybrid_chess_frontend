import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GameDetailsPage from "../GameDetails/GameDetailsPage";
import Referee from "../Referee/Referee";

//npm install react-router-dom@6
export default function Navigation() {

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/chess">Hybrid_Chess</Link>
                        </li>
                        <li>
                            <Link to="/game-details">Game Details</Link>
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
                    {/* Weitere Routen für andere Seiten */}
                </Switch>
            </div>
        </Router>
    );
}


