import Ratings from '../models/ratings_model.js'
import asyncHandler from 'express-async-handler'

export const postRating = asyncHandler(async (req, res) => {
  try {
    const rating = new Ratings(req.body)
    await rating.save()
    console.log('rating.save worked')

    const pipeline = [
      {
        $match: {
          place_id: req.body.place_id
        }
      }, {
        $group: {
          _id: '$place_id',
          avg_rating: {
            $avg: '$value'
          }
        }
      }
    ]
    const ratings = await Ratings.aggregate(pipeline)

    res.status(200).json(ratings)
  } catch (error) {
    res.status(400).send(error)
  }
})

export const getValue = asyncHandler(async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          place_id: req.body.place_id
        }
      }, {
        $group: {
          _id: '$place_id',
          avg_rating: {
            $avg: '$value'
          }
        }
      }
    ]
    const ratings = await Ratings.aggregate(pipeline)
    res.status(200).json(ratings)
  } catch (error) {
    res.status(400).send(error)
  }
})

export const getRatings = asyncHandler(async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          place_id: req.body.place_id,
          review: {
            $exists: true
          }
        }
      }, {
        $sort: {
          date_visited: -1
        }
      }, {
        $limit: req.body.limit
      }, {
        $project: {
          _id: '$_id',
          review: '$review',
          value: '$value',
          tags: '$tags',
          date_visited: '$date_visited',
          user_email: '$user_email',
          user_name: '$user_name', 
          flagged: '$flagged'
        }
      }
    ]
    const reviews = await Ratings.aggregate(pipeline)
    res.status(200).json(reviews)
  } catch (error) {
    res.status(400).send(error)
  }
})

export const getRatingsByUser = asyncHandler(async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          user_email: req.body.user_email
        }
      },
      {
        $limit: req.body.limit
      },
      {
        $project: {
          review: '$review',
          value: '$value',
          tags: '$tags',
          date_visited: '$date_visited',
          user_email: '$user_email',
          user_name: '$user_name'
        }
      }
    ]
    const reviews = await Ratings.aggregate(pipeline)
    res.status(200).json(reviews)
  } catch (error) {
    res.status(400).send(error)
  }
})

export const flaggingRating  = asyncHandler(async (req, res) => {
  console.log(req.body._id )
  const filter = { _id: req.body._id };
// update the value of the 'z' field to 42
  const updateDocument = {
    $set: {
      flagged: true,
    },
};
const result = await Ratings.updateOne(filter, updateDocument);
console.log(result)
res.status(200).json(result)
})