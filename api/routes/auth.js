import express from 'express'
import { register, login , logout , getUserProfile} from '../controllers/auth.js'


const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/userProfile", getUserProfile)



export default router