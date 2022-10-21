import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' })
      }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
<<<<<<< HEAD
  isBanned: {
    type: Boolean,
    default: false
=======
  verificationCode: {
    type: String,
    required: false
>>>>>>> develop
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  name: {
    type: String,
    required: true,
    minLength: 2
  },
  gender: {
    type: String,
    required: false
  },
  race: {
    type: String,
    required: false
  },
  disability: {
    type: String,
    required: false
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
})

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this
  if (user.isBanned) {
    throw new Error({ error: 'Invalid login: user is banned' })
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}

userSchema.statics.findByEmail = async (email) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}
const User = mongoose.model('User', userSchema)
export default User
