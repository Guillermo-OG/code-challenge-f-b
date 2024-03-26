<template>
  <div>
    <h1>Business Metrics Dashboard</h1>
    <div>
      <button @click="goToUpload">Upload Another File</button>
    </div>

    <div v-if="loaded">
      <line-chart :chart-data="mrrChartData" :options="lineChartOptions" />
      <line-chart
        :chart-data="churnRateChartData"
        :options="lineChartOptions"
      />
      <bar-chart
        :chart-data="subscriptionsVsChurnChartData"
        :options="barChartOptions"
      />
      <line-chart :chart-data="arpuChartData" :options="lineChartOptions" />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script lang="ts">
interface MetricData {
  month: string
  year: number
  MRR: number
  ChurnRate: number
  MRRNewSubscriptions: number
  MRRChurn: number
  ARPU: number
}

import { defineComponent, onMounted, ref } from "vue"
import { metricsData as metricsDataMock } from "../mocks/metricsData"
import { Chart, registerables, ChartData } from "chart.js"
import { LineChart, BarChart } from "vue-chart-3"
import { useRouter } from "vue-router"
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

      const mrrData = metricsData.map((data) => data.MRR)
      const churnRateData = metricsData.map((data) => data.ChurnRate)
      const mrrNewSubscriptionsData = metricsData.map(
        (data) => data.MRRNewSubscriptions
      )
      const mrrChurnData = metricsData.map((data) => data.MRRChurn)
      const arpuData = metricsData.map((data) => data.ARPU)

      mrrChartData.value = {
        labels,
        datasets: [
          { label: "MRR", data: mrrData, borderColor: "blue", fill: false },
        ],
      }

      churnRateChartData.value = {
        labels,
        datasets: [
          {
            label: "Churn Rate",
            data: churnRateData,
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
            data: mrrNewSubscriptionsData,
            backgroundColor: "green",
          },
          { label: "Churn", data: mrrChurnData, backgroundColor: "red" },
        ],
      }

      arpuChartData.value = {
        labels,
        datasets: [
          { label: "ARPU", data: arpuData, borderColor: "purple", fill: true },
        ],
      }

      loaded.value = true
    }

    onMounted(() => {
      prepareChartData()
    })

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    }

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
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
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-container {
  width: 80%;
  height: 500px;
}
</style>
