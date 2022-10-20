import jwt from 'jsonwebtoken'
import Business from '../models/business_model.js'

import User from '../models/users_model.js'

const auth = async(req, res, next) => {
    console.log("Request Body")
    console.log(req.body)
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}

const authBusiness = async(req, res, next) => {
    console.log("Request Body")
    console.log(req.body)
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        const business = await Business.findOne({ _id: data._id, 'tokens.token': token })
        if (!business) {
            throw new Error()
        }
        req.business = business
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}

export default auth