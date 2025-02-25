import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ratingRouter from './routes/ratings_route.js'
import placesRouter from './routes/places_route.js'
import userRouter from './routes/users_route.js'
import businessRouter from './routes/business_route.js';
import activismRouter from './routes/activism_route.js'
const result = dotenv.config()
if (result.error) {
  throw result.error
}

const app = express()
const PORT = process.env.PORT
const MONGO_KEY = process.env.MONGO_KEY

app.use(cors())

// mongoose.connect('mongodb://127.0.0.1:27017/CivilityOptics', { useNewUrlParser: true });
mongoose.connect(MONGO_KEY, { useNewUrlParser: true })
const connection = mongoose.connection

connection.once('open', function () {
  console.log('MongoDB database connection established successfully')
})

app.use(express.json())
app.use(ratingRouter);
app.use(placesRouter);
app.use(userRouter);
app.use(businessRouter);
app.use(activismRouter);

app.listen(PORT, function () {
  console.log('Server is running on Port ' + PORT)
  if (typeof process.env.GOOGLE_MAPS_API_KEY === 'undefined') {
    console.log('WARNING: GOOGLE_MAPS_API_KEY is undefined.')
    console.log('  Maps services will be unavailable.')
    console.log('  To launch the server with an API Key, create a .env file in the backend folder')
    console.log('  Contact Michael Verges for the API Key.')
  } else {
    console.log('GOOGLE_MAPS_API_KEY ' + process.env.GOOGLE_MAPS_API_KEY)
  }
})
