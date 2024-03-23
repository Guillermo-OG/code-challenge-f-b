<template>
  <div class="home">
    <h1>Welcome to the Business Metrics Dashboard</h1>
    <p>
      Select a spreadsheet (.xlsx or .csv) to upload and analyze your business
      metrics.
    </p>
    <input type="file" @change="handleFileUpload" />
    <div v-if="uploadStatus">
      <p>File uploaded successfully. Processing data...</p>
      <!-- Placeholder for after the file upload is handled -->
    </div>
    <div class="charts">
      <!-- Placeholder for charts. Replace with your chart components -->
      <p>Charts will be displayed here.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      uploadStatus: false,
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      // Placeholder for file upload logic. Implement your upload logic here.
      console.log(`File selected for upload: ${file.name}`)
      this.uploadStatus = true
      // After file is handled, set uploadStatus to true to simulate successful upload
    },
  },
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>
