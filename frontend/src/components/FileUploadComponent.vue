<template>
  <div class="file-upload-box">
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-overlay" v-if="isLoading">
        <div class="spinner"></div>
      </div>
    </div>
    <div class="upload-title">Upload</div>
    <div class="dropzone-area" v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b485c445813f61d2093b0716284119fd0385bca82106d8e3ad3ddfd4ad41ab2a?"
        class="dropzone-image"
      />
      <div class="dropzone-text">
        <span v-if="isDragActive">Drop the files here...</span>
        <span v-else
          >Drag & drop files or <span class="browse-link">Browse</span></span
        >
      </div>
      <div class="supported-formats">Supported formats: CSV, XLSX</div>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

    <button
      :class="[
        'button-base',
        'upload-button',
        { 'upload-button-disabled': isButtonDisabled },
      ]"
      :disabled="isButtonDisabled"
      @click="uploadFile"
    >
      Upload Files
    </button>
  </div>
</template>

<script lang="ts">
import axios from "axios"
import { defineComponent, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useDropzone } from "vue3-dropzone"

export default defineComponent({
  name: "FileUpload",
  setup() {
    const router = useRouter()
    const selectedFile = ref<File | null>(null)
    const errorMessage = ref<string>("")
    const isLoading = ref(false)

    const isButtonDisabled = computed(() => !selectedFile.value)
    // Dropzone setup
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles: any) => {
        if (acceptedFiles.length > 1) {
          errorMessage.value = "Only one file can be uploaded at a time."
          return
        }
        selectedFile.value = acceptedFiles[0]
      },
      accept: ".csv, .xlsx", // Limit file types
      multiple: false, // Allow only one file
    })

    async function uploadFile() {
      if (!selectedFile.value) return

      const formData = new FormData()
      formData.append("file", selectedFile.value)
      isLoading.value = true
      const backendUrl =
        process.env.VUE_APP_BACKEND_URL || "http://localhost:3000"
      const uploadEndpoint = `${backendUrl}/file-upload/upload`

      try {
        const response = await axios.post(uploadEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        console.log(response.data) // Handle response

        // Redirect to /metrics after successful upload
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
      } finally {
        isLoading.value = false
      }
    }

    return {
      isButtonDisabled,
      getRootProps,
      getInputProps,
      isDragActive,
      selectedFile,
      uploadFile,
      errorMessage,
      isLoading,
    }
  },
})
</script>

<style scoped>
.file-upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #f3f4f6; /* Neutral 100 */
}

.file-upload-box {
  display: flex;
  flex-direction: column;
  padding: 12px;
  max-width: 540px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.upload-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #111827; /* Stone 950 */
}

.dropzone-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 16px;
  border: 2px dashed #cbd5e1; /* Slate 50 */
  border-color: rgba(99, 102, 241, 0.3); /* Blue 800 with opacity */
  border-radius: 6px;
  background-color: #f0fdfa; /* Slate 50 */
}

.dropzone-image {
  margin-top: 16px;
  aspect-ratio: 1.15;
  width: 69px;
}

.dropzone-text {
  margin-top: 12px;
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: #4f46e5; /* Indigo 800 */
  text-decoration: underline;
}

.dropzone-text span {
  color: #111827; /* Stone 950 */
  text-decoration: none;
}

.supported-formats {
  margin-top: 5px;
  font-size: 12px;
  line-height: 20px;
  color: #6b7280; /* Stone 500 */
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
}

.upload-button {
  color: #fff;
  background-color: #4f46e5; /* Indigo 800 */
}

.upload-button-disabled {
  background-color: #3730a3;
  color: #c2bebe;
  cursor: not-allowed;
}

.error-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #fecaca; /* Rojo claro para errores */
  border-radius: 4px;
  color: #991b1b; /* Rojo oscuro para texto */
  text-align: center;
  width: 100%;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco con opacidad */
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-upload-box {
  position: relative; /* Para el overlay de carga */
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
