import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    tags: {
        type: Array
    },
    place_id: {
        type: String,
        required: true
    },
    date_visited: {
        type: Date,
        required: true
    },
    review: {
        type: String,
        required: false
    },
    user_email: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    }
});

ratingsSchema.statics.findByEmail = async (email) => {
    // Search for a rating by email
    const rating = await Ratings.find({ email: user_email });

    if (!rating) {
      throw new Error({ error: "Invalid login credentials" });
    }
    console.log(rating);
    return rating;
  };

const Ratings = mongoose.model('Ratings', ratingsSchema);
export default Ratings