import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'
import google from 'googleapis'
import User from '../models/users_model.js'

export const verifyCode = asyncHandler(async (req, res, next) => {
  try {
    const verifyCode = req.body.verifycode
    if (req.user.verificationCode !== undefined && verifyCode === req.user.verificationCode) {
      req.user.verificationCode = undefined
      next()
    } else {
      res.status(403).send({ error: 'Verification code does not match' })
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

export const getUserFromEmail = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email)
    if (!user) {
      return res.status(401).send({ error: 'Forgot password failed! Email not found' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send(error)
  }
})

export const sendCode = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isVerified) {
      const verifyCode = await generateUserCode(req.user)

      // Generate message containing code
      const message = {
        from: '"Civility Optics" <no-reply@civilityoptics.com>',
        to: req.user.email,
        subject: 'Verify Email for "Civility Optics" app',
        html: '<p>You requested for email verification, kindly use this code "' + verifyCode +
        '" to verify your email address on the app</p>'
      }

      await sendMessage(message)
    }

    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

export const sendPasswordCode = asyncHandler(async (req, res) => {
  try {
    const passwordCode = await generateUserCode(req.user)

    // Generate message containing code
    const message = {
      from: '"Civility Optics" <no-reply@civilityoptics.com>',
      to: req.user.email,
      subject: 'Forgot Password for "Civility Optics" app',
      html: '<p>You requested to change a forgotten password, kindly use this code "' + passwordCode +
      '" to reset your password on the app.</p>'
    }

    await sendMessage(message)

    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isVerified) {
      req.user.isVerified = true
      await req.user.save()
      res.send()
    } else {
      res.status(403).send({ error: 'User already verified' })
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

export const changePassword = asyncHandler(async (req, res) => {
  try {
    req.user.password = req.body.newPassword
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(400).send(error)
  }
})

// Emails an inputted message
async function sendMessage (message) {
  // Set up email authentification client
  // Note: Google may deprecate, so keep up to date
  const oAuth2Client = new google.Auth.OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  )
  // Use credentials from .env file
  oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN })
  const accToken = await oAuth2Client.getAccessToken()
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EHOST,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accToken
    }
  })

  // Send using nodemailer client
  transport.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
  })
}

// Generates an alphanumeric code and appends it to a user tuple
async function generateUserCode (user) {
  // Generate a random alphanumeric code
  const code = Math.random().toString(36).substring(2, 7)
  // Save it to relation for verification purposes
  user.verificationCode = code
  await user.save()
  return code
}
