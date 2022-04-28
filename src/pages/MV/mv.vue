<template>
  <div>
    {{ mvId }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const mvId = ref()

onMounted(() => {
  mvId.value = route.query.id
})
</script>

<route>
{
  name: "mv",
  meta: {
    keepAlive: true,
  }
}
</route>
