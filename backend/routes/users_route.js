import express from 'express'
import auth from '../controllers/auth_controller.js'
import { sendCode, sendPasswordCode, verifyCode, getUserFromEmail, verifyEmail, changePassword } from '../controllers/mail_controller.js'
import { postUser, getUser, loginUser, logoutUser, logoutUserAll } from '../controllers/users_controller.js'

const userRouter = express.Router()

userRouter.route('/users').post(postUser)

userRouter.route('/users/login').post(loginUser)

userRouter.route('/users/me').post(auth, getUser)

userRouter.route('/users/me/logout').post(auth, logoutUser)

userRouter.route('/users/me/logoutall').post(auth, logoutUserAll)

userRouter.route('/users/me/sendcode').post(auth, sendCode)

userRouter.route('/users/me/verifyEmail').post(auth, verifyCode, verifyEmail)

userRouter.route('/users/me/changePassword').post(auth, changePassword)

userRouter.route('/users/sendPasswordCode').post(getUserFromEmail, sendPasswordCode)

userRouter.route('/users/changeForgottenPassword').post(getUserFromEmail, verifyCode, changePassword)

export default userRouter
