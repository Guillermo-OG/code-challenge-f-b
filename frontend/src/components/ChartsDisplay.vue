<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

export default {
  name: "ChartsDisplay",
  mounted() {
    const ctx = document.getElementById("myChart").getContext("2d")
    const myChart = new Chart(ctx, {
      type: "line", // Example chart type
      data: {
        labels: [], // Dynamic data
        datasets: [
          {
            label: "Sample Data",
            data: [], // Dynamic data
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  },
}
</script>
