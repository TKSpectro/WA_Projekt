# Planbee | Web Aufbau Projekt

Von [Bilal Alnaani](https://github.com/bilal0710), [Tom Käppler](https://github.com/TKSpectro)

## Allgemeines

Dieses Projekt ist ein Kanban-Board, welches eine Oberfläche für die Organisation/Tracking von Aufgaben bereitstellt.

Funktionallitäten die implementiert wurden:
* Kanban-Board
    * Task Erstellung, Bearbeitung und Verschieben
    * Hinzufügen von Workflows
* Login/Logout
* Chat
    * Public
    * Privat-Chats mit einzelnen Personen
* Projekt-Wechsel
* Dokumentation der Api (ApiDoc)
* User-Management
* User-Info
* Datenschutz, Impressum

## Release
Das Projekt wird Live auf Heroku gehostet: [WA-Project](https://wa-project.herokuapp.com)

Die Datenbank wird ebenfalls über Heroku gehostet: JawsDB-MySQL

Die Api-Dokumentation ist über [ApiDoc](https://wa-project.herokuapp.com/apidoc/) erreichbar

Login-Daten:
* Email: tom@mail.com Passwort: `12345678`  -> Admin
* Email: bilal@mail.com Passwort: `12345678` -> Admin
* Email: friess@mail.com Passwort: `12345678` -> Admin
* Email: willie@mail.com Passwort: `12345678` -> Alles außer User-Management
* Email: era@mail.com Passwort: `12345678` -> Nur Zugriff auf Task-Management

## Installation

* Node.JS Version 14.2.0 (npm)
* XAMPP (Apache und  MySql)
* Lokal die Datenbank "taskboard" erstellen (utf8_general_ci)
* In Terminal ausführen:
    * In den Hauptordner des Projekts navigieren
    * `npm install`
    * `npx grunt build`
    * `npx sequelize-cli db:migrate`
    * `npx sequelize-cli db:seed:all`
* Anwendung ausführen oder `npx nodemon`

Dadurch wurden bereits Login-Daten generiert:
* Email: tom@mail.com Passwort: `12345678`  -> Admin
* Email: bilal@mail.com Passwort: `12345678` -> Admin
* Email: friess@mail.com Passwort: `12345678` -> Admin
* Email: willie@mail.com Passwort: `12345678` -> Alles außer User-Management
* Email: era@mail.com Passwort: `12345678` -> Nur Zugriff auf Task-Management


Die Datei `src/apidoc/CRUD.postman_collection.json` kann in Postman importiert werden um die API Schnittstellen zu testen. Dafür wird aber ein Environment gebraucht, welches durch die Datei `src/apidoc/NodeProject.postman_environment.json` importiert werden kann.

### Wer hat was gemacht:
| Aufgabe        | Person      |
| :-------------: |:-------------:
| Design            | vorrangig Bilal
| Permission-System | Tom    
| Controller        | Beide    
| ApiDoc            | Beide    
| Backend           | Beide   
| Javascript        | Beide
| Webseiten         | Beide    

### Verwendete Technologie
    - Visual Studio Code
    - ApiDoc, bCrypt, body-parser, dotenv, EJS, Express, html5sortable, Grunt, jsonwebtoken, MySql2,(Express)serve-favicon , Sequelize, Sequelize-CLI, Socket.io
    - Versionskontrollsystem: Git/GitHub
    - Kommunikation: Discord, CiscoWebex