const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema
const workoutSchema = new Schema({
    date: {
        type: Date,
        default: new Date().toLocaleDateString({
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    },
    day: {
      type: Number,
      default: new Date().getDay()
    },
    exercises: [
        {
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                min: 1,
                required: true
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

// virtual attribute to tally total duration for each exercise in a group
workoutSchema.virtual("totalDuration").get(function () {
    let totalDuration = 0;
    this.exercises.forEach(function (exercise) {
        totalDuration += exercise.duration;
    })

    return totalDuration;
});

// virtual attribute to tally total weight for each exercise in a group
workoutSchema.virtual("totalWeight").get(function () {
    let totalWeight = 0;
    this.exercises.forEach(function (exercise) {
        if (exercise.weight) {
            totalWeight += ((exercise.reps * exercise.sets) * exercise.weight);
        } else {
            totalWeight += 0;
        }
    })
    return totalWeight;
});

// create the model
const Workout = mongoose.model("Workout", workoutSchema);

// export the model
module.exports = Workout;