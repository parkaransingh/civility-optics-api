import express from 'express'
import auth from '../controllers/auth_controller.js'

import { getValue, postRating, getReviews, getReviewsByUser } from '../controllers/ratings_controller.js'

const ratingRouter = express.Router()

ratingRouter.route('/ratings/postRating').post(postRating)

ratingRouter.route('/ratings/getValue').post(getValue)

ratingRouter.route('/ratings/getReviews').post(getReviews)

ratingRouter.route('/ratings/getReviewsByUser').post(getReviewsByUser)

export default ratingRouter
