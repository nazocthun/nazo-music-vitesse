<template>
  <el-container direction="vertical">
    <NavBar class="bg-slate-300/50" relative items-center />
    <MainPage class="fixed top-16 bottom-16 w-full" />
    <BottomZone class="bg-slate-300/50" fixed bottom-0 h-16 w-full />
  </el-container>
  <!-- <Footer /> -->
</template>

<script setup lang="ts">

</script>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html, body{
  margin:0;
  height:100%;
}
</style>
