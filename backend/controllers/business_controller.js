import Business from '../models/business_model.js'
import asyncHandler from 'express-async-handler'

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

export const getBusiness = asyncHandler(async(req, res) => {
    // View logged in business profile
    res.send(req.business)
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