<template>
  <div>
    {{ mvId }}
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{ mvId: string }>()
const mvId = ref()

onMounted(() => {
  mvId.value = props.mvId
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
