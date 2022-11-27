import mongoose from 'mongoose'


const Schema = mongoose.Schema

const activismSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  tips: {
    type: String,
    required: true,
  },
  resources: {
    type: String,
    required: true,
  },
})



activismSchema.statics.findByTitle = async (title) => {
  // Search for a business by email and password.
  const activism = Activism.findOne({ title })
  if (!activism) {
    throw new Error({ error: 'Invalid title' })
  }
  return activism
}


const Activism = mongoose.model('Activism', activismSchema)
export default Activism