<template>
  <div>
    <input type="file" @change="onFileChange" />
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      this.$emit("file-selected", file)
    },
  },
}
</script>
