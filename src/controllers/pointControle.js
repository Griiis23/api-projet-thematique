//#region Import de prisma
import pkg from '@prisma/client'
import 'dotenv/config'
import { io } from 'socket.io-client'
import fs from 'fs'
//#endregion

//#region Pour récupérer le chemin absolu du projet
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename).substring(0, path.dirname(__filename).lastIndexOf('src')) + 'src'
//#endregion

//équivaut à const PrismaClient = pkg.PrismaClient (déstructuration)
const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { pointControle: PointControle } = prisma

//On export les fonctions
export default {
    //#region On récupère tous
    getAll(req, res) {
        PointControle.findMany()
            .then((data) => {
                res.status(200).send(data)
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || 'Une erreur à été rencontrée lors de la récupération des posts',
                })
            })
    },
    //#endregion

    //#region photos
    getPhotos(req, res) {
        const { courseId } = req.params

        //On vérifie que le dossier existe (qu'il y ai eu au moins un passage)
        let dossards = ''
        if (fs.existsSync(__dirname + '/www/photos/' + courseId)) {
            dossards = fs.readdirSync(__dirname + '/www/photos/' + courseId)
            let photos = []

            //On itère sur tous les dossiers dossard
            for (let index = 0; index < dossards.length; index++) {
                const dossard = dossards[index]

                let photoDossard = fs.readdirSync(__dirname + '/www/photos/' + courseId + '/' + dossard)

                //On itère sur toutes les photos d'un dossard
                for (let idx = 0; idx < photoDossard.length; idx++) {
                    const photo = photoDossard[idx]

                    photos.push({
                        dossard: dossard,
                        url: 'photos/' + courseId + '/' + dossard + '/' + photo,
                    })
                }
            }

            res.status(200).send(photos)
        } else {
            res.status(404).send("Aucun point de controle n'existe pour cette course")
        }
    },
    //#endregion

    //#region classement
    getClassement(req, res) {
        const { courseId } = req.params

        PointControle.findMany({
            where: {
                courseId: parseInt(courseId),
            },
            orderBy: [
                {
                    distance: 'desc',
                },
                {
                    timestamp: 'asc',
                },
            ],
        })
            .then((data) => {
                if (data != null) {
                    let classement = []

                    for (let index = 0; index < data.length; index++) {
                        const element = data[index]
                        classement.push({
                            pos: index + 1,
                            dossard: element.dossard,
                        })
                    }

                    res.status(200).send(classement)
                } else {
                    res.status(404).send({
                        message: `l'utilisateur n'a pas été trouvé : courseId=${courseId}`,
                    })
                }
            })
            .catch((error) => {
                res.status(500).send({
                    message:
                        error.message ||
                        `Une erreur à été rencontrée lors de la récupération de l'utilisateur courseId=${courseId}`,
                })
            })
    },
    //#endregion

    //#region On récupère grâce à l'id
    get(req, res) {
        const { courseId } = req.params

        PointControle.findMany({
            where: {
                courseId: parseInt(courseId),
            },
            orderBy: {
                timestamp: 'desc',
            },
        })
            .then((data) => {
                if (data != null) {
                    res.status(200).send(data)
                } else {
                    res.status(404).send({
                        message: `l'utilisateur n'a pas été trouvé : courseId=${courseId}`,
                    })
                }
            })
            .catch((error) => {
                res.status(500).send({
                    message:
                        error.message ||
                        `Une erreur à été rencontrée lors de la récupération de l'utilisateur courseId=${courseId}`,
                })
            })
    },
    //#endregion

    //#region On créer un point de controle
    create(req, res) {
        const { dossard, timestamp, distance, courseId, image } = req.body

        // Remove the data prefix from the base64 string
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

        // Create a buffer from the base64 data
        const buffer = Buffer.from(base64Data, 'base64')

        // Generate a unique file name or use any naming convention you prefer
        const fileName = `image_${Date.now()}.png`

        // Specify the directory where you want to save the image
        const directoryPath = __dirname + `/www/photos/${courseId}/${dossard}`

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true })
        }

        // Specify the file path where you want to save the image
        const filePath = directoryPath + '/' + fileName

        // Write the buffer to the file
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error(err)
                // Handle the error appropriately
                res.status(500).send('Error writing image to disk')
            }
        })

        PointControle.findFirst({
            where: {
                dossard: dossard,
                distance: distance,
            },
        })
            .then(() => {
                res.status(200).send({
                    message: 'Ce dossard est déjà apparu à ce kilomètre',
                })
            })
            .catch(() => {
                PointControle.create({
                    data: {
                        dossard: parseInt(dossard),
                        timestamp: parseInt(timestamp),
                        distance: parseInt(distance),
                        courseId: parseInt(courseId),
                    },
                })
                    .then((data) => {
                        const socket = io('ws://localhost:3000')

                        // Send notification to server for update
                        socket.emit('course', data.courseId)
                        res.status(201).send(data)
                    })
                    .catch((error) => {
                        res.status(500).send({
                            message: error.message || 'Some error occurred while creating the PointControle',
                        })
                    })
            })
    },
    //#endregion

    //#region On modifie un point de controle
    update(req, res) {
        const { id } = req.params

        //COURSE ID METTRE DANS FICHIER DE CONF
        const { dossard, timestamp, distance } = req.body

        PointControle.update({
            where: {
                id: parseInt(id),
            },
            data: {
                dossard: parseInt(dossard),
                timestamp: timestamp,
                distance: distance,
            },
        })
            .then(() => {
                res.status(200).send({
                    message: 'PointControle was updated successfully',
                })
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || `Some error occurred while updating the PointControle with id=${id}`,
                })
            })
    },
    //#endregion

    //#region On supprime un point de controle
    delete(req, res) {
        const { id } = req.params

        const deletePointControle = PointControle.delete({
            where: {
                id: parseInt(id),
            },
        })

        prisma
            .$transaction([deletePointControle])
            .then(() => {
                res.status(200).send({
                    message: 'PointControle was deleted successfully',
                })
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || `Some error occurred while deleting the Course with id=${id}`,
                })
            })
    },
    //#endregion
}
