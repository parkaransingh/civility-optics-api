import express from 'express'
import auth from '../controllers/auth_controller.js'
import { postBusiness, getBusiness, loginBusiness, logoutBusiness, logoutBusinessAll } from '../controllers/businesss_controller.js'

const businessRouter = express.Router()

businessRouter.route('/businesss').post(postBusiness)

businessRouter.route('/businesss/login').post(loginBusiness)

businessRouter.route('/businesss/me').get(auth, getBusiness)

businessRouter.route('/businesss/me/logout').post(auth, logoutBusiness)

businessRouter.route('/businesss/me/logoutall').post(auth, logoutBusinessAll)

export default businessRouter