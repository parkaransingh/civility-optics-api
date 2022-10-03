import express from 'express'
import auth from '../controllers/auth_controller.js'

import { getRating, postRating, getReviews, getUserReviews } from '../controllers/ratings_controller.js'

const ratingRouter = express.Router()

ratingRouter.route('/postRating').post(postRating)

ratingRouter.route('/getRating').post(getRating)

ratingRouter.route('/getReviews').post(getReviews)
ratingRouter.route('/getReviewsUser').post(getUserReviews)

export default ratingRouter
