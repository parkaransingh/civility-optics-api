import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'
import google from 'googleapis'

export const sendCode = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isVerified) {
      // Generate a random alphanumeric code
      const verifyCode = Math.random().toString(36).substring(2, 7)
      // Save it to relation for verification purposes
      req.user.verificationCode = verifyCode
      await req.user.save()
      console.log('User verification code saved')

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
      // Generate message containing code
      const message = {
        from: '"Civility Optics" <no-reply@civilityoptics.com>',
        to: req.user.email,
        subject: 'Verify Email for "Civility Optics" app',
        html: '<p>You requested for email verification, kindly use this code "' + verifyCode +
        '" to verify your email address on the app</p>'
      }
      // Send using nodemailer client
      transport.sendMail(message, (error, info) => {
        if (error) {
          return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
      })
    }

    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

export const verifyCode = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isVerified) {
      const verifyCode = req.body.verifycode
      if (req.user.verificationCode !== undefined && verifyCode === req.user.verificationCode) {
        req.user.isVerified = true
        req.user.verificationCode = undefined
        await req.user.save()
      } else {
        res.status(403).send({ error: 'Verification code does not match' })
      }
    }

    res.send()
  } catch (error) {
    res.status(400).send(error)
  }
})
