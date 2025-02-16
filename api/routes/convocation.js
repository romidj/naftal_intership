import express from 'express'
import { Message, ConvoAnnuaire } from '../controllers/convocation.js'


const router = express.Router()

router.post("/Message", Message)
router.post("/settings",ConvoAnnuaire)


export default router