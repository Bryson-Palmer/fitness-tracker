const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema
const workoutSchema = new Schema({
    day: {
        type: Date,
        default: new Date(new Date().setDate(new Date().getDate()))
        // new Date creates a new date object. 
        // setDate sets the day of the month to the date object.
        // getDate returns the day of the month (from 1 to 31)
    },
    exercises: [
        {
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: [true, "Let's name this workout."]
            },
            duration: {
                type: Number,
                min: [1, "Minimum duration for a workout is 1 minute."],
                required: [true, "Please add a duration for this workout."]
            },
            weight: Number,
            reps: Number,
            sets: Number,
            distance: Number
        }
    ]
}, {
    toJSON: { virtuals: true }
});

workoutSchema.virtual("totalDuration").get(function () {
    let totalDuration = 0;
    this.exercises.forEach(function (exercise) {
        totalDuration += exercise.duration;
    })

    return totalDuration;
});

// create the model
const Workout = mongoose.model("Workout", workoutSchema);

// export the model
module.exports = Workout;