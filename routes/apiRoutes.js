const router = require("express").Router();

const { Workout } = require("../models");

// Get all workouts
router.get("/api/workouts", ( req, res ) => {

    Workout.find({})
        .then( workouts => {
            res.json( workouts );
        })
        .catch( err => {
            res.status( 500 ).json( err );
        });

});

// Create a new workout
router.post("/api/workouts", ( req, res ) => {

    Workout.create( req.body )
        .then( createWorkout => {
            res.json( createWorkout );
        })
        .catch( err => {
            res.status( 500 ).json( err );
        });

});

// Update the array of workouts by id
router.put("/api/workouts/:id", ( req, res ) => {

    const newExercise = req.body;

    Workout.findByIdAndUpdate(
        {
            _id: req.params.id
        }, { 
            $push: {
                exercises: newExercise
        }
    }, {
        new: true
    })
    .then( addExercise => {
        res.json( addExercise );
    })
    .catch( err => {
        res.status( 500 ).json( err );
    });

});

// Get worouts in range
router.get("/api/workouts/range", ( req, res ) => {

    Workout.find({})
        .limit(7)
        .then( workoutRange => {
            res.json( workoutRange );
        })
        .catch( err => {
            res.status( 500 ).json( err );
        });
});

module.exports = router;