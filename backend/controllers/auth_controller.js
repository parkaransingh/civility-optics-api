import jwt from 'jsonwebtoken'

import User from '../models/users_model.js'

// This function searches for a user with the matching token
const auth = async (req, res, next) => {
  const token = req.body.Authorization.replace('Bearer ', '')
  const data = jwt.verify(token, process.env.JWT_KEY)
  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      // no matching token
      res.status(402).send({ error: 'Not authorized to access this resource' })
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

export default auth
