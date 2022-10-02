import express from 'express'
import auth from '../controllers/auth_controller.js'
import { postBusiness, getBusiness, loginBusiness, logoutBusiness, logoutBusinessAll } from '../controllers/business_controller.js'

const businessRouter = express.Router()

businessRouter.route('/businesses').post(postBusiness)

businessRouter.route('/businesses/login').post(loginBusiness)

businessRouter.route('/businesses/me').post(getBusiness)

businessRouter.route('/businesses/me/logout').post(auth, logoutBusiness)

businessRouter.route('/businesses/me/logoutall').post(auth, logoutBusinessAll)

export default businessRouter