import Activism from "../models/activism_model.js";
import asyncHandler from 'express-async-handler'

export const postActivism = asyncHandler(async (req, res) => {
    // Create a new activism
    try {
      const activism = new Activism(req.body)
      await activism.save()
      console.log('activism created')
     
      // user.sendEmailConfirmation()
      res.status(201).send({ activism })
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  })

  export const getActivism = asyncHandler(async (req, res) => {
    // retrievesActivism
    try {
        const { title } = req.body
        const activism = await Activism.findByTitle(title)
        if (!activism) {
            return res.status(401).send({ error: 'could not find title' })
          }
     
      res.status(201).send({ activism })
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  })