require('dotenv').config();

module.exports = {
    development : {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taskboard',
        host:     process.env.DB_HOST || 'localhost',
        dialect:  'mysql'
    },
    test : {
        username: 'root',
        password: '',
        database: 'taskboard',
        host:     'localhost',
        dialect:  'mysql'
    },
    production : {
        username: 'root',
        password: '',
        database: 'taskboard',
        host:     'localhost',
        dialect:  'mysql'
    }
}