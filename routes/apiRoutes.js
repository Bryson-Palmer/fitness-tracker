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
    })
        .catch(err => {
            res.status(500).json(err);
        });

});

// Get worouts in range
router.get("/api/workouts/range", (req, res) => {

    Workout.find({})
        .sort({date: -1})
        .then((workoutsDb) => {
            let newWorkoutsDb = sumSameDay(workoutsDb);
            res.json(newWorkoutsDb);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Merging same date data
function sumSameDay(workoutsDb) {
    let newWorkoutsDb = [];
    let counter = 0;
    // All workouts in reverse
    workoutsDb.sort((a, b) => { 

            if (a.day === b.day) {
                console.log("b.day", b.day);
                console.log("a.day", a.day);
                console.log("Match!!!");
            
                newWorkoutsDb.push({
                    date: b.date,
                    day: b.day,
                    _id: [b._id, a._id],
                    exercises: [...b.exercises, ...a.exercises],
                    id: [b.id, a.id],
                    totalDuration: b.totalDuration + a.totalDuration,
                    totalWeight: b.totalWeight + a.totalWeight,
                }); 
                console.log("counter", counter);
                newWorkoutsDb.splice(counter+1, 1);
                counter++;
            } else {
                console.log("___________");
                console.log("b.day", b.day);
                console.log("a.day", a.day);
                console.log("No Match...");
                console.log("counter", counter);
                newWorkoutsDb.push(b);
                
                if ((workoutsDb.length-2) === counter) {
                    newWorkoutsDb.push(a);
                }
                counter++;
            }
    });
    // console.log("newWorkoutsDb", newWorkoutsDb);
    return newWorkoutsDb;
}

// function sumSameDay(workoutsDb) {
//     console.log("workoutsDb.length", workoutsDb.length);
//     let results = [];
//     let counter = 0;
    
//     workoutsDb.sort((a, b) => {
//         if(b.day === a.day) {
//             console.log("b^^^^^^^", b);
//             console.log("a", a);
//             console.log("Hi!!!!!");

//             counter++;
//             results.push({
//                 date: b.date,
//                 day: b.day,
//                 _id: [b._id, a._id],
//                 exercises: [...b.exercises, ...a.exercises],
//                 id: [b.id, a.id],
//                 totalDuration: b.totalDuration + a.totalDuration,
//                 totalWeight: b.totalWeight + wa.totalWeight,
//             });
//             results.pop(b);
//             console.log("results", results);
//         } else {
//             console.log("a", a);
//             console.log("Hello!!!!!");
//             counter++;
//             results.push(a);
//             if ((workoutsDb.length -1) === counter) {
//                 console.log("b*******", b);
//                 results.push(b);
//             }
//         }
//     })
        
    
//     console.log("results", results);
//     return results;
// }

module.exports = router;