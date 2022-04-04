<template>
  <el-input v-model="input" class="searchbox" placeholder="搜索">
    <template #suffix>
      <div flex items-center h-full>
        <div w-6 h-6 i-ic-sharp-search @click="search" />
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
const input = ref()

function search() {
  console.log('search', input.value)
}

</script>

<style lang="scss">
$search-icon-color: rgba(0, 0, 0, 0.5);

.searchbox input {
  width: 200px;
  border-radius: 20px;
  box-shadow: none;
  outline: none;
  font-size: 14px;
  background-color: rgba(63, 114, 175, 0.7);
  --el-input-hover-border-color: transparent;
  --el-input-focus-border-color: transparent;
  --el-input-text-color: rgba(0, 0, 0, 0.7);
  --el-input-placeholder-color: rgba(0, 0, 0, 0.3);
}

.searchbar{
  margin: auto 8px auto auto ;
  box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, 1);
}

.el-input__suffix {
  color: $search-icon-color;
}
</style>
