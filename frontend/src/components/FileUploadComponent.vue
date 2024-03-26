<template>
  <div class="file-upload">
    <h2>Upload your .csv or .xlsx file</h2>
    <input type="file" @change="onFileChange" accept=".csv, .xlsx" />
    <button @click="uploadFile">Upload File</button>
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import axios from "axios"
import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "FileUpload",
  setup() {
    const router = useRouter()
    const selectedFile = ref<File | null>(null)
    const errorMessage = ref<string>("")

    function onFileChange(e: Event) {
      const input = e.target as HTMLInputElement
      if (!input.files?.length) return
      selectedFile.value = input.files[0]
    }

    async function uploadFile() {
      if (!selectedFile.value) return
      const formData = new FormData()
      formData.append("file", selectedFile.value)

      const backendUrl =
        process.env.VUE_APP_BACKEND_URL || "http://localhost:3000"
      const uploadEndpoint = `${backendUrl}/file-upload/upload`

      try {
        console.log("hola")
        const response = await axios.post(uploadEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        console.log(response.data) // Handle response
        // Redireciona para /metrics após o sucesso do upload
        sessionStorage.setItem(
          "metricsData",
          JSON.stringify(response.data.metrics)
        )
        router.push("/metrics")
      } catch (error) {
        errorMessage.value = "Failed to upload file."
        if (axios.isAxiosError(error) && error.response) {
          errorMessage.value = error.response.data.message
        }
      }
    }

    return { onFileChange, uploadFile, errorMessage }
  },
})
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}
</style>
