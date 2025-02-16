import express from 'express'
import {infoemployees ,infodirection , updateRdvState, dashbord, infoEMP} from '../controllers/user.js'

const router = express.Router()

router.get('/direction/:directionId/employees', infoemployees);

router.get('/direction',infodirection)

router.post('/employees/:id/update-rdv-state', updateRdvState);

router.get('/dashbord',dashbord)

router.get('/employee/:employeeId/info', infoEMP)



export default router