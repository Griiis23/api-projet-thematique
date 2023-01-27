//Import de express
import express from 'express'

//Initialisation du routeur
const router = express.Router()

//Import des controlleurs
import { courseController } from '../controllers'

//Déclaration des routes
router.get('/', courseController.getAll)
router.get('/:id', courseController.get)
router.post('/', courseController.create)
router.put('/:id', courseController.update)
router.delete('/:id', courseController.delete)

//Export des routes
export default router
