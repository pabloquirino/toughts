import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import FileStoreModule from 'session-file-store'
import path from 'path'
import os from 'os'
import flash from 'express-flash'
// DB
import conn from './db/conn.js'
// Models
import Toughts from './model/Toughts.js'
import User from './model/User.js'
// Route
import toughtsRoutes from './routes/toughtsRoutes.js'
import authRoutes from './routes/authRoutes.js'
// Controller
import ToughtController from './controllers/ToughtController.js'

const app = express()
const FileStore = FileStoreModule(session) 

// works as a “box” where session information will be stored
const store = new FileStore({
    logFn: () => {},
    path: path.join(os.tmpdir(), 'sessions')
})

// template engine
const hbs = create({ extname: 'handlebars' })
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// receive responses from the body
app.use(express.urlencoded({ extended: true }))
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

// middleware routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts) // main bar points to showToughts 

conn 
    .sync()
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))