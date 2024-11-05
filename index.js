import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import FileStoreModule from 'session-file-store'
import path from 'path'
import os from 'os'
import flash from 'express-flash'
import conn from './db/conn.js'

const app = express()

const FileStore = FileStoreModule(session) // creates a system that stores session information in files

// works as a “box” where session information will be stored
const store = new (FileStore(session))({
    logFn: () => {},
    path: path.join(os.tmpdir(), 'sessions')
})

// template engine
const hbs = create({
    extname: 'handlebars'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// receive responses from the body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: "session",
        secret: 'our_secret',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

conn 
    .sync()
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))