<template>
  <div flex>
    <div class="sidebar">
      <ul>
        <li>
          <div i-ic-sharp-subscriptions />
          <router-link to="/">
            推荐音乐
          </router-link>
        </li>
        <li>
          <div i-ic-sharp-featured-play-list />
          <router-link to="/customlists">
            网友歌单
          </router-link>
        </li>
        <li>
          <div i-ic-sharp-library-music />
          <router-link to="/selectedlists">
            精选歌单
          </router-link>
        </li>
        <li>
          <div i-ic-sharp-fiber-new />
          <router-link to="/newmusic">
            最新音乐
          </router-link>
        </li>
        <li>
          <div i-ic-sharp-music-video />
          <router-link to="/musicvideo">
            音乐视频
          </router-link>
        </li>
      </ul>
    </div>

    <div w-full m-0 h-full>
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="route.name" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
// @import '@/styles/custom.scss';
  .sidebar {
    margin: 0;
    padding: 0;
    width: 200px;
    min-width: 200px;
    background-color: rgba(203, 241, 245, 0.5);
    text-align: center;
    border-right: 1px solid #ededed;
  }
  .sidebar ul {
    list-style: none;
    margin-top: 0;
    padding-left: 0;
  }
  .sidebar ul li {
    text-align: left;
    cursor: pointer;
    letter-spacing: .3rem;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sidebar ul li div {
    margin-left: 1rem;
    width: 2rem;
    height: 2rem;
  }
  .sidebar li:hover {
    background-color: $custom_hover_color;
  }

  .sidebar a::before {
    content: '';
    margin-right: 10px;
  }

  .sidebar a {
    text-decoration: none;
    color: currentColor;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 18px;
    padding-left: 20px;
    text-align: left;
  }
</style>
