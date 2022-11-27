import express from 'express'
import { postActivism, getActivism } from '../controllers/activism_controller.js'
const activismRouter = express.Router()

activismRouter.route('/activism/create').post(postActivism)
activismRouter.route('/activism/get').post(getActivism)

export default activismRouter