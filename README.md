# Web Aufbau Projekt

Von [Tom Käppler](https://github.com/TKSpectro), [Bilal Alnaani](https://github.com/bilal0710)

## Release
Das Projekt wird Live auf Heroku gehostet: [WA-Project](https://wa-project.herokuapp.com)

Die Datenbank wird ebenfalls über Heroku(JawsDB-MySQL) gehostet

Die Api-Dokumentation ist über [ApiDoc](https://wa-project.herokuapp.com/apidoc/) erreichbar

## Installation

* Node.JS Version 14.2.0 (npm)
* XAMPP (Apache und  MySql)
* lokal die Datenbank "taskboard" erstellen
* In Terminal ausführen:
    * `npm install`
    * `npx grunt build`
    * `npx sequelize-cli db:migrate`
    * `npx sequelize-cli db:seed:all`
* Anwendung ausführen oder `npx nodemon`

Dadurch wurden bereits Login-Daten generiert:
* Email: tom@mail.com Passwort: `12345678`
* Email: bilal@mail.com Passwort: `12345678`


Die Datei `src/apidoc/CRUD.postman_collection.json` kann in Postman importiert werden um die API Schnittstellen zu testen. Dafür wird aber ein Environment gebraucht, welches durch die Datei `src/apidoc/NodeProject.postman_environment.json` importiert werden kann.

### Verwendete Technologie
    - Visual Studio Code
    - ApiDoc, Socket.io, Sequelize, MySql, Express, EJS, bCrypt, Grunt
    - Versionskontrollsystem: Git/GitHub
    - Kommunikation: Discord, CiscoWebex