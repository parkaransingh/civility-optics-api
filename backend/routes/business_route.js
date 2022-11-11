import express from 'express'
import { authBusiness } from '../controllers/auth_controller.js'
import { postBusiness, getBusiness, loginBusiness,getBusinessByKey, logoutBusiness, logoutBusinessAll, patchBusiness } from '../controllers/business_controller.js'

const businessRouter = express.Router()

businessRouter.route('/businesses').post(postBusiness)

businessRouter.route('/businesses/update').post(authBusiness, patchBusiness)

businessRouter.route('/businesses/getDescription').post(getBusinessByKey)

businessRouter.route('/businesses/login').post(loginBusiness)

businessRouter.route('/businesses/me').post(getBusiness)

businessRouter.route('/businesses/me/logout').post(authBusiness, logoutBusiness)

businessRouter.route('/businesses/me/logoutall').post(authBusiness, logoutBusinessAll)

export default businessRouter
