import express from 'express'
import auth from '../controllers/auth_controller.js'
import { sendMail, verifyCode } from '../controllers/mail_controller.js'
import { postUser, getUser, loginUser, logoutUser, logoutUserAll } from '../controllers/users_controller.js'

const userRouter = express.Router()

userRouter.route('/users').post(postUser)

userRouter.route('/users/login').post(loginUser)

userRouter.route('/users/me').post(auth, getUser)

userRouter.route('/users/me/logout').post(auth, logoutUser)

userRouter.route('/users/me/logoutall').post(auth, logoutUserAll)

userRouter.route('/users/verify/send').post(auth, sendMail)

userRouter.route('/users/verify/receive').post(auth, verifyCode)

export default userRouter
