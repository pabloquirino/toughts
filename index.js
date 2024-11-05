import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import FileStoreModule from 'session-file-store'
import flash from 'express-flash'
import conn from './db/conn.js'

const FileStore = FileStoreModule(session)
const app = express()

conn 
    .sync()
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))