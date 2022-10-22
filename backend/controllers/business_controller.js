import Business from '../models/business_model.js'
import asyncHandler from 'express-async-handler'
import { callbackPromise } from 'nodemailer/lib/shared/index.js'


export const postBusiness = asyncHandler(async(req, res) => {
    // Create a new business
    try {
        const business = new Business(req.body)
        await business.save()
        const token = await business.generateAuthToken()
        console.log("Auth Token Generated")
        // business.sendEmailConfirmation()
        res.status(202).send({ business, token })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export const patchBusiness = asyncHandler(async(req, res) => {
    // Updates a new business
    try {
    req.business.email = req.body.email
    req.business.password = req.body.password
    req.business.business_name = req.body.business_name
    req.business.business_key = req.body.business_key
    req.business.business_addr = req.body.business_addr
    req.business.save()
    console.log('New Document Information Saved')
    // business.sendEmailConfirmation()
    const business = req.business
    res.status(202).send({ business })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
export const getBusiness = asyncHandler(async(req, res) => {
    // View logged in business profile
    //res.send(req.business)
    try {
        const { email } = req.body
        const business = await Business.findByEmail(email)
        if (!business) {
            return res.status(401).send({error: 'Business lookup failed'})
        }
        res.send({ business })
    } catch (error) {
        res.status(400).send(error)
    }
})

export const loginBusiness = asyncHandler(async(req, res) => {
    //Login a registered business
    try {
        const { email, password } = req.body
        const business = await business.findByCredentials(email, password)
        if (!business) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await business.generateAuthToken()
        res.send({ business, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

export const logoutBusiness = asyncHandler(async(req, res) => {
    // Log business out of the application
    try {
        req.business.tokens = req.business.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.business.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

export const logoutBusinessAll = asyncHandler(async(req, res) => {
    // Log business out of all devices
    try {
        req.business.tokens.splice(0, req.business.tokens.length)
        await req.business.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})