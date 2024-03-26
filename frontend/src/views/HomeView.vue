<template>
  <div class="home">
    <h1>Welcome to the Business Metrics Dashboard</h1>
    <FileUploadComponent />
  </div>
</template>

<script>
import FileUploadComponent from "@/components/FileUploadComponent.vue"

export default {
  name: "HomeView",
  components: {
    FileUploadComponent,
  },
  data() {
    return {
      uploadStatus: false,
    }
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
