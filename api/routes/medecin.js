import express from 'express'
import {listEmpEnAttente, listEmpTermine} from '../controllers/medecin.js'

const router = express.Router()


router.get('/listeEmpEnAttente', listEmpEnAttente)
router.get('/listeEmpTermine', listEmpTermine)

export default router