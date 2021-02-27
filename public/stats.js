// get all workout data for the last seven workouts from back-end

fetch("/api/workouts/range")
  .then(response => {

    return response.json();
  })
  .then(data => {
    // Get response data
    console.log("data", data);

    // Get the last 7 days
    let slicedData = data.slice(0, 7);

    let chartData = orderByCurrentDay(slicedData);
    console.log("chartData", chartData);

    // Populate chart
    populateChart(chartData);

    // Date string in nav bar on stats page
    const dateEl = document.querySelector(".todaysDate");
    const p = document.createElement("p");
    let currentDate = (new Date().toDateString("en-US"));
    p.textContent = currentDate;
    dateEl.appendChild(p);
    console.log("currentDate", currentDate);
    console.log("currentDay", new Date().getDay());

    // Sort array from oldest to newest
    // chartData.sort((a, b) => {
    //   if (a.day > b.day) return 1;
    //   if (a.day < b.day) return -1
    //   return 0;
    // });

    // Check for duplicatesin in an array - example
    function noDuplicateArrayElements(arr) {
      let sorted_arr = arr.slice().sort();
      // console.log("sorted_arr", sorted_arr);
      let results = [];
      for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
          results.pop(sorted_arr[i]);
          results.push(sorted_arr[i + 1]);
        } else {
          results.push(sorted_arr[i + 1]);
        }
      }
      return results;
    }

    let colors = ["red", "orange", "blue", "green", "red", "blue"];
    let noDuplicateColors = noDuplicateArrayElements(colors);//["blue", "green", "orange", "red"]
    // console.log("noDuplicateColors", noDuplicateColors);
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
  let dynamicDayLabels = orderDayLabels();
  const colors = generatePalette();

  // Console logs for different data
  console.log("eachTotalDuration:", eachTotalDuration);
  console.log("Pounds:", pounds);
  console.log("Workouts", workouts);
  console.log("everyDuration", everyDuration);
  console.log("strengthWorkouts", strengthWorkouts);
  console.log("strengthData", strengthData);
  console.log("dynamicDayLabels", dynamicDayLabels);

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: dynamicDayLabels,
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
      labels: dynamicDayLabels,
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
    // workout.exercises.forEach(exercise => {
    if (workout.totalWeight) {
      total.push(workout.totalWeight);
    } else {
      total.push(0);
    }
    // });
  });
  return total;
}

// Get every workout name
function workoutNames(chartData) {
  let workouts = [];

  chartData.forEach(workout => {
    workout.exercises.forEach(exercise => {
      workouts.push(exercise.name);
    });
  });

  return workouts;
}

// Get every workout duration
function allDurations(chartData) {
  let durations = [];

  chartData.forEach(workout => {
    workout.exercises.forEach(exercise => {
      durations.push(exercise.duration);
    });
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

// Get the current day and order the 7 day labels for the charts
function orderDayLabels() {
  let currentDayLabels = [];
  let currentDay = new Date().getDay();

  if (currentDay === 0) {
    currentDayLabels.push(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    )
  }

  if (currentDay === 1) {
    currentDayLabels.push(
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
    )
  }

  if (currentDay === 2) {
    currentDayLabels.push(
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
    )
  }

  if (currentDay === 3) {
    currentDayLabels.push(
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
    )
  }

  if (currentDay === 4) {
    currentDayLabels.push(
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    )
  }

  if (currentDay === 5) {
    currentDayLabels.push(
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    )
  }

  if (currentDay === 6) {
    currentDayLabels.push(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    )
  }

  return currentDayLabels;
}

// Get the current day and order the 7 day labels for the charts
function orderByCurrentDay(workoutData) {
  let newOrderData = [];
  let currentDay = new Date().getDay();

  if (currentDay === 0) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[1],
      workoutData[2],
      workoutData[3],
      workoutData[4],
      workoutData[5],
      workoutData[6],
      workoutData[0],
    )
  }

  if (currentDay === 1) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[2],
      workoutData[3],
      workoutData[4],
      workoutData[5],
      workoutData[6],
      workoutData[0],
      workoutData[1],
    )
  }

  if (currentDay === 2) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[3],
      workoutData[4],
      workoutData[5],
      workoutData[6],
      workoutData[0],
      workoutData[1],
      workoutData[2],
    )
  }

  if (currentDay === 3) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[4],
      workoutData[5],
      workoutData[6],
      workoutData[0],
      workoutData[1],
      workoutData[2],
      workoutData[3],
    )
  }

  if (currentDay === 4) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[5],
      workoutData[6],
      workoutData[0],
      workoutData[1],
      workoutData[2],
      workoutData[3],
      workoutData[4],
    )
  }

  if (currentDay === 5) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[6],
      workoutData[5],
      workoutData[4],
      workoutData[3],
      workoutData[2],
      workoutData[1],
      workoutData[0],
    )
  }

  if (currentDay === 6) {
    console.log("workoutData[0]", workoutData[0]);
    newOrderData.push(
      workoutData[0],
      workoutData[1],
      workoutData[2],
      workoutData[3],
      workoutData[4],
      workoutData[5],
      workoutData[6],
    )
  }


  return newOrderData;
}