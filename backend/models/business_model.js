import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendMail from '../controllers/mail_controller.js'

const Schema = mongoose.Schema;

const businessSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({error: 'Invalid Email address'})
      }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  //business key represents the Google Places API key when the business is searched for on the map
  business_key: {
    type: String,
    required: true,
    minLength: 0
  },
  business_name: {
    type: String,
    required: true,
    minLength: 0
  },
  business_address: {
    type: String,
    required: true,
    minLength: 0
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

businessSchema.pre('save', async function (next) {
  // Hash the password before saving the business model
  const business = this
  if (business.isModified('password')) {
    business.password = await bcrypt.hash(business.password, 8)
  }
  next()
})

businessSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the business
  const business = this
  const token = jwt.sign({_id: business._id}, process.env.JWT_KEY)
  business.tokens = business.tokens.concat({token})
  await business.save()
  return token
}

businessSchema.methods.sendEmailConfirmation = async function() {
  // Generate an auth token for the business
  const business = this
  sendMail("subject", "plaintext", "<p>html</p>", business.email)
}

businessSchema.statics.findByCredentials = async (email, password) => {
  // Search for a business by email and password.
  const business = await Business.findOne({ email} )
  if (!business) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = await bcrypt.compare(password, business.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  return business
}


const Business = mongoose.model('Business', businessSchema)
export default Business