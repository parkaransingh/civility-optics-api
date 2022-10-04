import express from 'express'
import auth from '../controllers/auth_controller.js'

import { getValue, postRating, getReviews, getReviewsByUser } from '../controllers/ratings_controller.js'

const ratingRouter = express.Router()

ratingRouter.route('/postRating').post(postRating)

ratingRouter.route('/getValue').post(getValue)

ratingRouter.route('/getReviews').post(getReviews)
ratingRouter.route('/getReviewsByUser').post(getReviewsByUser)

export default ratingRouter
