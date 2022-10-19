import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'
import google from 'googleapis'

export const sendMail = asyncHandler(async (req, res) => {
  try {
    const verifyCode = Math.random().toString(36).substring(2, 7)
    req.user.verificationCode = verifyCode
    await req.user.save()
    console.log('User verification code saved')

    const oAuth2Client = new google.Auth.OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_REDIRECT_URI
    )
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
    const message = {
      from: '"Civility Optics" <no-reply@civilityoptics.com>',
      to: req.user.email,
      subject: 'Verify Email for "Civility Optics" app',
      html: '<p>You requested for email verification, kindly use this code "' + verifyCode +
      '" to verify your email address on the app</p>'
    }
    transport.sendMail(message, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
    })

    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

export const verifyCode = asyncHandler(async (req, res) => {
  try {
    const verifyCode = req.body.verifycode
    if (req.user.verificationCode !== undefined && verifyCode === req.user.verificationCode) {
      req.user.isVerified = true
      req.user.verificationCode = undefined
      await req.user.save()
    } else {
      res.status(403).send({ error: 'Verification code does not match' })
    }

    res.send()
  } catch (error) {
    res.status(400).send(error)
  }
})
