<template>
  <div flex h-16>
    <div text-2xl text-orange-700 h-full w="200px" flex items-center justify-center font-bold cursor-default>
      Nazo Music
    </div>
    <div flex h-8 mr-auto ml-8>
      <div h-8 w-8 mx-3 hover:bg="white/30" rounded-full cursor-pointer @click="go(-1)">
        <div h-full w-full bg="black/70" i-ic-sharp-keyboard-arrow-left />
      </div>
      <div h-8 w-8 mx-3 hover:bg="white/30" rounded-full cursor-pointer @click="go(1)">
        <div h-full w-full bg="black/70" i-ic-sharp-keyboard-arrow-right />
      </div>
    </div>
    <div class="serachbar" mr-8>
      <SearchBox />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function go(destnation: number) {
  router.go(destnation)
}

</script>

<style>
  
</style>
