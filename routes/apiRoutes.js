const router = require("express").Router();

const { Workout } = require("../models");

// Get all workouts
router.get("/api/workouts", (req, res) => {

    Workout.find()
        .then((workoutsDb) => {
            res.json(workoutsDb);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);

        });

});

// Create a new workout
router.post("/api/workouts", (req, res) => {

    Workout.create(req.body)
        .then((workoutsDb) => {
            res.json(workoutsDb);
        })
        .catch(err => {
            res.status(500).json(err);
        });

});

// Update the array of workouts by id
router.put("/api/workouts/:id", (req, res) => {

    // const updateWorkout = req.body;
    // console.log(updateWorkout);
    Workout.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                exercises: req.body,
            }
        }, {
        new: true,
        runValidators: true
    }).then((workoutsDb) => {
        res.json(workoutsDb);
        console.log(workoutsDb);
    })
        .catch(err => {
            res.status(500).json(err);
        });

});

// Get worouts in range
router.get("/api/workouts/range", (req, res) => {

    Workout.find({})
        .limit(7)
        .then((workoutsDb) => {
            res.json(workoutsDb);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;