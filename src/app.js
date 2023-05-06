//#region Import des librairies (dotenv pour les variables d'environnement, express pour le serveur web, cors pour les cors)
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
//#endregion

//#region Pour récupérer le chemin absolu du projet
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//#endregion

//#region Serveur Web (Front)
const webServer = express()
webServer.use('/', express.static(__dirname + '/www'))
webServer.listen(process.env.WEB_PORT, () => {
    console.log('---------------Server WEB opérationnel---------------\nhttp://localhost:' + process.env.WEB_PORT)
})
//#endregion

//#region Serveur Socket
const app = express()
import http from 'http'
const socketServ = http.createServer(app)
import { Server } from 'socket.io'
const io = new Server(socketServ, {
    cors: {
        origin: '*',
    },
})

io.on('connection', function (socket) {
    socket.on('course', (data) => {
        io.emit('course', data)
    })
})
socketServ.listen(3000, () => {
    console.log('---------------Serveur socket opérationnel---------------')
})
//#endregion

//#region Serveur API
const server = express()

//Utilisation des cors etc...
// server.use(express.json())
// server.use(express.urlencoded({ extended: false }))
server.use(cors())
server.use(express.urlencoded({ limit: '50mb', extended: true }))
server.use(express.json({ limit: '50mb' }))

//Paramètrage des headers
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    //Get : récup, POST : insert, PUT : update, DELETE : remove
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    next()
})

//Route initial pour voir que le serveur fonctionne bien
server.get('/', (req, res) => {
    res.status(200).json({
        message: 'server is working !',
    })
})

//Import des routes en une seule ligne grâce au fichier index.js
import { pointControleRoutes, courseRoutes } from './routes/'

//On préfixe les routes avec post ou user
server.use('/course', courseRoutes)
server.use('/pointControle', pointControleRoutes)

//On écoute sur le port indiquer dans le .env
server.listen(process.env.SERVER_PORT, () => {
    console.log('---------------Server API opérationnel---------------')
})

//export du serveur
export default server
//#endregion
