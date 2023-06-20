import React from "react";
import 'bulma/css/bulma.css';
export default function Home() {

    return (
        <>
            <div className="container">
                <div className="has-background-success-light has-text-centered pt-6 pb-6">
                    <h1 className="title is-3">Startseite</h1>
                    <h2 className="title is-4">Hybrid Chess</h2>

                    <h3 className="subtitle is-5">Inhalt und Ziel des Projekts</h3>
                    <div className="columns is-centered">
                        <div className="column is-three-quarters is-centered has-background-info-light">
                            <p className="has-text-justified">
                                Das Schachspiel des Projekts "Hybrid Chess" soll von einer Person am Brett und einer Person an einem internetfähigen Gerät spielbar sein.
                                Der Person am internetfähigen Gerät werden über eine Internetseite die Positionen der Figuren angezeigt.
                                Auf einer Benutzeroberfläche im Browser können Züge ausgeführt werden, die der Person am Brett angezeigt werden.
                                Diese Person setzt die Figuren der eigenen und der über das Internet übermittelten Züge.
                                Die Software des Schachspiels erkennt unzulässige Züge, besondere Züge, beispielsweise eine Rochade und die Figurenkonstellationen wie zum Beispiel Schachmatt.
                            </p>
                        </div>
                    </div>

                    <h3 className="subtitle is-5">Funktionsweise und Vorgehen</h3>
                    <div className="columns is-centered">
                        <div className="column is-three-quarters is-centered has-background-info-light">
                            <p className="has-text-justified">
                                Das durch einen 3D-Drucker erzeugte Schachbrett für "Hybrid Chess" ist auf jedem Feld mit Kontakten und LEDs ausgestattet.
                                Auch die verwendeten Schachfiguren sind an ihrer Unterseite mit Kontakten versehen.
                                Mithilfe eines Raspberry Pis werden Veränderungen der Positionen der Schachfiguren erfasst und überprüft.
                                Diese Überprüfung umfasst das Erkennen unzulässiger Bewegungen oder das Bewegen falscher Figuren.
                                Auch Sonderzüge wie das En-passant-Schlagen, die Bauernumwandlung oder die Rochade werden registriert.
                                Die Züge werden übermittelt und für die zweite spielende Person im Browser dargestellt.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}
