// get all workout data for the last seven workouts from back-end

fetch("/api/workouts/range")
  .then(response => {

    return response.json();
  })
  .then(data => {
    data.sort((a, b) => { return a.day - b.day });
    populateChart(data);

    // Date string in nav bar on stats page
    const dateEl = document.querySelector(".todaysDate");
    const p = document.createElement("p");
    let currentDate = (new Date().toDateString("en-US"));
    p.textContent = currentDate;
    dateEl.appendChild(p);
    console.log("currentDate", currentDate);

  });


API.getWorkoutsInRange()

function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ]

  return arr;
}

function populateChart(data) {
  let eachTotalDuration = totalDurations(data);
  let pounds = calculateTotalWeight(data);
  let workouts = workoutNames(data);
  let everyDuration = allDurations(data);
  let strengthWorkouts = strengthWorkoutNames(data);
  let everyStrengthData = allStrengthData(data);
  const colors = generatePalette();

  console.log("eachTotalDuration:", eachTotalDuration);
  console.log("Pounds:", pounds);
  console.log("Workouts", workouts);
  console.log("everyDuration", everyDuration);
  console.log("strengthWorkouts", strengthWorkouts);
  console.log("everyStrengthData", everyStrengthData);

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          data: eachTotalDuration,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Pounds",
          data: pounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: everyDuration
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Duration of Excercises"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: strengthWorkouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: everyStrengthData
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercise with Weights"
      }
    }
  });
}

// Get total durations for workouts of each day
function totalDurations(data) {
  let durations = [];
  
  data.forEach(workout => {
    if (workout.totalDuration) {
      durations.push(workout.totalDuration);
    } else {
      durations.push(0);
    }
  });
  return durations;
}

// Get all the pounds
function calculateTotalWeight(data) {
  let total = [];
  console.log("data", data);
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.weight) {
        total.push(exercise.weight);
      } else {
        total.push(0);
      }
    });
  });
  return total;
}

// Get every workout name
function workoutNames(data) {
  let workouts = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      workouts.push(exercise.name);
    });
  });

  return workouts;
}

// Get every workout duration
function allDurations(data) {
  let durations = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      durations.push(exercise.duration);
    });
  });

  return durations;
}

// Get all strength workout names
function strengthWorkoutNames(data) {
  let strengthExercises = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].exercises.length; j++) {

      if (data[i].exercises[j].weight) {
        strengthExercises.push(data[i].exercises[j].name);
      }
    }
  }
  return strengthExercises;
}

// Get all strength data for each workout name
function allStrengthData(data) {
  let strengthData = [];
  
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].exercises.length; j++) {

      if (data[i].exercises[j].weight) {
        strengthData.push(data[i].exercises[j].weight);
      }
    }
  }
  return strengthData;
}