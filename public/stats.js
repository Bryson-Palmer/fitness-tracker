// get all workout data for the last seven workouts from back-end

fetch("/api/workouts/range")
  .then(response => {

    return response.json();
  })
  .then(data => {
    // Get response data
    console.log("data", data);

    // Slice off the last 7 workouts
    let chartData = data.slice(0, 7);
    console.log("chartData", chartData.reverse());

    // Populate chart
    populateChart(chartData);

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

function populateChart(chartData) {
  let eachTotalDuration = totalDurations(chartData);
  let pounds = calculateTotalWeight(chartData);
  let workouts = workoutNames(chartData);
  let everyDuration = allDurations(chartData);
  let strengthWorkouts = strengthWorkoutNames(chartData);
  let strengthData = allStrengthData(chartData);
  let dynamicLabels = orderLabels(chartData);
  const colors = generatePalette();

  // Console logs for different data
  console.log("eachTotalDuration:", eachTotalDuration);
  console.log("Pounds:", pounds);
  console.log("Workouts", workouts);
  console.log("everyDuration", everyDuration);
  console.log("strengthWorkouts", strengthWorkouts);
  console.log("strengthData", strengthData);
  console.log("dynamicDayLabels", dynamicLabels);

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: dynamicLabels,
      datasets: [
        {
          label: "minutes",
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
        display: true,
        text: "Total Time Per Workout (minutes)"
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
      labels: dynamicLabels,
      datasets: [
        {
          label: "pounds",
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
        text: "Total Weight Lifted Per Workout (sets x reps x pounds)"
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
        text: "Duration Per Excercise (minutes)"
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
          data: strengthData
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Weight Lifted Per Exercise (pounds)"
      }
    }
  });
}

// Get total durations for workouts of each day
function totalDurations(chartData) {
  let durations = [];

  chartData.forEach(workout => {
    if (workout.totalDuration) {
      durations.push(workout.totalDuration);
    } else {
      durations.push(0);
    }
  });

  return durations;
}

// Get total weight lifter for a workout session
function calculateTotalWeight(chartData) {
  let total = [];

  chartData.forEach(workout => {
    if (workout.totalWeight) {
      total.push(workout.totalWeight);
    } else {
      total.push(0);
    }
  });

  return total;
}

// Get every workout name
function workoutNames(chartData) {
  let workouts = [];

  chartData.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        workouts.push(exercise.name);
      });
    } else {
      workouts.push("");
    }
  });

  return workouts;
}

// Get every workout duration
function allDurations(chartData) {
  let durations = [];

  chartData.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        durations.push(exercise.duration);
      });
    } else {
      durations.push(0);
    }
  });

  return durations;
}

// Get all strength workout names
function strengthWorkoutNames(chartData) {
  let strengthExercises = [];

  for (let i = 0; i < chartData.length; i++) {
    for (let j = 0; j < chartData[i].exercises.length; j++) {

      if (chartData[i].exercises[j].weight) {
        strengthExercises.push(chartData[i].exercises[j].name);
      }
    }
  }

  return strengthExercises;
}

// Get all strength data for each workout name
function allStrengthData(chartData) {
  let strengthData = [];

  for (let i = 0; i < chartData.length; i++) {
    for (let j = 0; j < chartData[i].exercises.length; j++) {

      if (chartData[i].exercises[j].weight) {
        strengthData.push(chartData[i].exercises[j].weight);
      }
    }
  }

  return strengthData;
}

// Order the 7 workout labels for the charts
function orderLabels(chartData) {
  let workoutLabels = [];

  chartData.forEach(workout => {
    if (workout.exercises) {
      if (workout.exercises.length > 1) {
        let exerciseNames = [];
        for (let i = 0; i < workout.exercises.length; i++) {
          exerciseNames.push(workout.exercises[i].name);
        }
        workoutLabels.push(exerciseNames);
      } else {
        for (let j = 0; j < workout.exercises.length; j++) {
          workoutLabels.push(workout.exercises[j].name);
        }

      }

    } else {
      workoutLabels.push("")
    }
  });

  return workoutLabels;
}