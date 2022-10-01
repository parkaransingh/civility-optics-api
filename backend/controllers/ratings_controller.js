import Ratings from '../models/ratings_model.js'
import asyncHandler from 'express-async-handler'

export const postRating = asyncHandler(async(req, res) => {
    try {
        const rating = new Ratings(req.body)
        await rating.save()
        console.log("rating.save worked")

        const pipeline = [
            {
              '$match': {
                'place_id': req.body.place_id
              }
            }, {
              '$group': {
                '_id': '$place_id', 
                'avg_rating': {
                  '$avg': '$value'
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

export const getRating = asyncHandler(async(req, res) => {
    try {
        const pipeline = [
            {
              '$match': {
                'place_id': req.body.place_id
              }
            }, {
              '$group': {
                '_id': '$place_id', 
                'avg_rating': {
                  '$avg': '$value'
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



export const getReviews = asyncHandler(async(req, res) => {
try {
    const pipeline = [
      {
        '$match': {
          'place_id': req.body.place_id, 
          'review': {
            '$exists': true
          }
        }
      }, {
        '$sort': {
          'date_visited': -1
        }
      }, {
        '$limit': req.body.limit
      }, {
        '$project': {
          'review': '$review',
          'value': '$value',
          'tags': '$tags',
          'date_visited': '$date_visited',
          'user_email': '$user_email',
          'user_name': '$user_name'
        }
      }
    ]
    const reviews = await Ratings.aggregate(pipeline)
    res.status(200).json(reviews)
} catch (error) {
    res.status(400).send(error)
}
})



export const getUserReviews = asyncHandler(async(req, res) => {
  try {
      const pipeline = [
          {
            '$match': {
              'user_email': req.body.email
            }
          }, {
            '$project': {
              'review': '$review',
              'value': '$value',
              'tags': '$tags',
              'date_visited': '$date_visited',
            }
          }
      ]
      const ratings = await Ratings.aggregate(pipeline)
      res.status(200).json(ratings)
  } catch (error) {
      res.status(400).send(error)
  }
})



// export const getRating2 = asyncHandler(async(req, res) => {
//   try {
//       const pipeline = [
//           {
//             '$match': {
//               'user_email': req.body.email
//             }
//           }, {
//             '$group': {
//               '_id': '$user_email',
//               {
//               '$reviews':  {
//                 'review': '$review',
//                 'value': '$value',
//                 'tags': '$tags',
//                 'date_visited': '$date_visited',
//                 'user_email': '$user_email',
//                 'user_name': '$user_name'
//               },
//               },
//             }
//           }
//       ]

//       const ratings = await Ratings.aggregate(pipeline)
//       res.status(200).json(ratings)
//   } catch (error) {
//       console.log("hello")
//       res.status(400).send(error)
//   }
// })


export const getUserReviews2 = asyncHandler(async(req, res) => {
  // View logged in user profile
  try {
      const { user_email } = req.body
      const ratings = await Ratings.findByEmail(user_email)
      console.log(ratings)
      if (!rating) {
          return res.status(401).send({error: 'User lookup failed'})
      }
      res.send({ ratings })
  } catch (error) {
      res.status(400).send(error)
  }
  // res.send(req.user)
})