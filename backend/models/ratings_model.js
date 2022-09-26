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

const Ratings = mongoose.model('Ratings', ratingsSchema);
export default Ratings