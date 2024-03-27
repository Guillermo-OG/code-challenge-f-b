<template>
  <div class="dashboard-container">
    <h1>Business Metrics Dashboard</h1>
    <div>
      <button class="button-base" @click="goToUpload">
        Upload Another File
      </button>
    </div>

    <div v-if="loaded" class="charts-container">
      <div class="chart-wrap">
        <line-chart :chart-data="mrrChartData" :options="lineChartOptions" />
      </div>
      <div class="chart-wrap">
        <line-chart
          :chart-data="churnRateChartData"
          :options="lineChartOptions"
        />
      </div>
      <div class="chart-wrap">
        <bar-chart
          :chart-data="subscriptionsVsChurnChartData"
          :options="barChartOptions"
        />
      </div>
      <div class="chart-wrap">
        <line-chart :chart-data="arpuChartData" :options="lineChartOptions" />
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { Chart, registerables, ChartData } from "chart.js"
import { LineChart, BarChart } from "vue-chart-3"
import { useRouter } from "vue-router"

interface MetricData {
  month: string
  year: number
  MRR: number
  ChurnRate: number
  MRRNewSubscriptions: number
  MRRChurn: number
  ARPU: number
}

// Asumiendo la existencia de una fuente de datos mock
import { metricsData as metricsDataMock } from "../mocks/metricsData"

Chart.register(...registerables)

export default defineComponent({
  components: {
    LineChart,
    BarChart,
  },
  setup() {
    const loaded = ref(false)
    const router = useRouter()
    const mrrChartData = ref<ChartData<"line", number[], string>>({
      labels: [],
      datasets: [],
    })
    const churnRateChartData = ref<ChartData<"line", number[], string>>({
      labels: [],
      datasets: [],
    })
    const subscriptionsVsChurnChartData = ref<
      ChartData<"bar", number[], string>
    >({ labels: [], datasets: [] })
    const arpuChartData = ref<ChartData<"line", number[], string>>({
      labels: [],
      datasets: [],
    })

    const prepareChartData = () => {
      const sessionMetricsData: MetricData[] = JSON.parse(
        sessionStorage.getItem("metricsData") || "[]"
      )
      const metricsData =
        sessionMetricsData.length > 0 ? sessionMetricsData : metricsDataMock
      const labels = metricsData.map((data) => `${data.month}/${data.year}`)

      mrrChartData.value = {
        labels,
        datasets: [
          {
            label: "MRR",
            data: metricsData.map((data) => data.MRR),
            borderColor: "blue",
            fill: false,
          },
        ],
      }
      churnRateChartData.value = {
        labels,
        datasets: [
          {
            label: "Churn Rate",
            data: metricsData.map((data) => data.ChurnRate),
            borderColor: "red",
            fill: false,
          },
        ],
      }
      subscriptionsVsChurnChartData.value = {
        labels,
        datasets: [
          {
            label: "New Subscriptions",
            data: metricsData.map((data) => data.MRRNewSubscriptions),
            backgroundColor: "green",
          },
          {
            label: "Churn",
            data: metricsData.map((data) => data.MRRChurn),
            backgroundColor: "red",
          },
        ],
      }
      arpuChartData.value = {
        labels,
        datasets: [
          {
            label: "ARPU",
            data: metricsData.map((data) => data.ARPU),
            borderColor: "purple",
            fill: true,
          },
        ],
      }

      loaded.value = true
    }

    onMounted(prepareChartData)

    const lineChartOptions = { responsive: true, maintainAspectRatio: false }
    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true } },
    }

    function goToUpload() {
      router.push("/")
    }

    return {
      mrrChartData,
      churnRateChartData,
      subscriptionsVsChurnChartData,
      arpuChartData,
      lineChartOptions,
      barChartOptions,
      loaded,
      goToUpload,
    }
  },
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.chart-wrap {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.button-base {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  border-radius: 6px;
  text-transform: uppercase;
  cursor: pointer;
  color: #fff;
  background-color: #4f46e5; /* Indigo 800 */
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .charts-container {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  .chart-wrap {
    min-height: 400px; /* Adjust based on your preference */
  }
}
</style>
