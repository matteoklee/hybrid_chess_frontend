import React from "react";
import 'bulma/css/bulma.css';
export default function Home() {

    return (
        <>
            <div className="container">
                <div className="has-background-info-light has-text-centered pt-3">
                    <h1 className="title is-3">Impressum</h1>
                    <h2 className="title is-4">Hybrid Chess</h2>
                    <h3 className="subtitle is-6">Projekt des Studiengangs Informatik 2021 im Fach "Future Internet/Internet of things" 2023</h3>
                    <p className="subtitle is-5">Dozent der Lehrveranstaltung: Herr Professor Drögehorn</p>
                    <p className="subtitle is-5">Die Teilnehmer des Projekts:</p>
                    <div className="columns is-mobile is-multiline is-centered">
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Projektleiter: </ul>
                            <ul><li>Marti Grunewald</li><li>Niklas Brose (bis zum 01.05.2023)</li></ul>
                        </div>
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Gruppe Hardware: </ul>
                            <ul><li>Florian Steinmann</li><li>Fabian Siemens</li><li>Niklas Schädlich</li></ul>
                        </div>
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Gruppe Backend: </ul>
                            <ul><li>Matteo Kleemann</li><li>Robert Lehmann</li></ul>
                        </div>
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Gruppe Datenbank: </ul>
                            <ul><li>Marcel Gerber</li></ul>
                        </div>
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Gruppe Datenbankentwurf: </ul>
                            <ul><li>Ludwig Heucke</li><li>Florian Ellhof</li></ul>
                        </div>
                        <div  className="column is-half">
                            <ul className="has-text-weight-bold">Gruppe Frontend: </ul>
                            <ul><li>Felix Stammnitz</li><li>Matthias Mersdorf</li></ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
