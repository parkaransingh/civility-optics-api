import express from 'express'
import auth from '../controllers/auth_controller.js'

import { getValue, postRating, getRatings, getRatingsByUser, flaggingRating } from '../controllers/ratings_controller.js'

const ratingRouter = express.Router()

ratingRouter.route('/ratings/postRating').post(postRating)

ratingRouter.route('/ratings/getValue').post(getValue)

ratingRouter.route('/ratings/getRatings').post(getRatings)

ratingRouter.route('/ratings/getRatingsByUser').post(getRatingsByUser)

ratingRouter.route('/ratings/flag').post(flaggingRating)

export default ratingRouter
