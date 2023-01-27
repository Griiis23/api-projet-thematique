//Import de prisma
import pkg from '@prisma/client'

//équivaut à const PrismaClient = pkg.PrismaClient (déstructuration)
const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { course: Course, coureur: Coureur } = prisma

//#region Pour récupérer le chemin absolu du projet
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename).substring(0, path.dirname(__filename).lastIndexOf('src')) + 'src'
//#endregion

//On export les fonctions
export default {
    //On récupère tous
    getAll(req, res) {
        Course.findMany()
            .then((data) => {
                res.status(200).send(data)
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || 'Une erreur à été rencontrée lors de la récupération des posts',
                })
            })
    },

    //On récupère grâce à l'id
    get(req, res) {
        const { id } = req.params

        Course.findUnique({
            where: {
                id: parseInt(id),
            },
        })
            .then((data) => {
                data
                    ? res.status(200).send(data)
                    : res.status(404).send({
                          message: `l'utilisateur n'a pas été trouvé : id=${id}`,
                      })
            })
            .catch((error) => {
                res.status(500).send({
                    message:
                        error.message ||
                        `Une erreur à été rencontrée lors de la récupération de l'utilisateur id=${id}`,
                })
            })
    },

    //On créer
    create(req, res) {
        const { nom, timestamp } = req.body

        Course.create({
            data: {
                nom: nom,
                timestamp: parseInt(timestamp),
            },
        })
            .then((data) => {
                res.status(200).send({
                    id: data.id,
                    path: __dirname + '/www/photos',
                })
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || 'Some error occurred while creating the Course',
                })
            })
    },

    //On modifie
    update(req, res) {
        const { id } = req.params
        const { nom } = req.body

        Course.update({
            where: {
                id: parseInt(id),
            },
            data: {
                nom: nom,
            },
        })
            .then(() => {
                res.status(200).send({
                    message: 'Course was updated successfully',
                })
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || `Some error occurred while updating the Course with id=${id}`,
                })
            })
    },

    //On supprime
    delete(req, res) {
        const { id } = req.params

        const deleteCoureur = Coureur.deleteMany({
            where: {
                courseId: parseInt(id),
            },
        })

        const deleteCourse = Course.delete({
            where: {
                id: parseInt(id),
            },
        })

        prisma
            .$transaction([deleteCoureur, deleteCourse])
            .then(() => {
                res.status(200).send({
                    message: 'Course was deleted successfully',
                })
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || `Some error occurred while deleting the Course with id=${id}`,
                })
            })
    },
}
