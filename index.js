import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import FileStoreModule from 'session-file-store'
import flash from 'express-flash'
import conn from './db/conn.js'

const FileStore = FileStoreModule(session)
const app = express()

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
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
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