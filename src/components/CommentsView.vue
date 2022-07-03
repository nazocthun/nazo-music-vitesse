<template>
  {{ data }}
</template>

<script setup lang="ts">
import { getAlbumComment } from '@/api/getAlbumInfo'

const data = ref()
await getAlbumComment({ id: 147476181 }).then((res) => {
  console.log(res)
  data.value = res
})
</script>

<style>

</style>
