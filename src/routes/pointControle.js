//Import de express
import express from 'express'

//Initialisation du routeur
const router = express.Router()

//Import des controlleurs
import { pointControleController } from '../controllers'

//Déclaration des routes
router.get('/', pointControleController.getAll)
router.get('/:courseId', pointControleController.get)
router.get('/classement/:courseId', pointControleController.getClassement)
router.get('/photos/:courseId', pointControleController.getPhotos)

//Création de la course et récupération de l'ID
router.post('/', pointControleController.create)
router.put('/:id', pointControleController.update)
router.delete('/:id', pointControleController.delete)

//Export des routes
export default router
