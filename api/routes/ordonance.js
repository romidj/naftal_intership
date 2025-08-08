import express from 'express'
import {save_ordonance} from '../controllers/medecin.js'

const router = express.Router()


router.post('/ordonances', save_ordonance)
export default router