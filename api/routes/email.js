import express from 'express'
import { emailSend } from '../controllers/email.js'


const router = express.Router()

router.post("/emailSend", emailSend)

export default router