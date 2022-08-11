# Nazo Music

## 简介
一款在线音乐播放器，是我个人练手的小项目，使用Vue3全家桶编写。
小部分UI风格参考**网易云音乐**，大部分个人原创
无做移动端适配。

> 请使用Chrome访问 **[在线演示](https://nazomusic.netlify.app/)** 

## 💪网易云音乐NodeJS版API
感谢开源项目 *NeteaseCloudMusicApi* 提供的支持<br>
> [Github地址](https://github.com/Binaryify/NeteaseCloudMusicApi)<br>
> [使用文档](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

## 👉技术栈
- Vue3
- Vite
- Vite File-based Routing
- Pinia
- ElementPlus
- Axios
- VueUse
- lodash
- UnoCSS

## 🚩运行项目
#### 后端
    # 使用npx启动项目（默认3000端口）
    npx NeteaseCloudMusicApi
#### 本项目
    # 克隆项目到本地
    https://github.com/nazocthun/nazo-music-vitesse.git

    # 进入项目文件夹
    cd nazo-music-vitesse

    # 安装依赖
    pnpm install

    # 启动项目（默认4000端口）
    npx vite --port=4000


## 🚀功能列表

- [x] 音乐/MV播放
  - [x] 播放/暂停/下一首/上一首
  - [x] 全局空格控制 播放/暂停
  - [x] 进度条控制
  - [x] 音量调节/静音
  - [x] 顺序播放/随机播放/单曲循环
  - [x] 播放历史
  - [x] 自动切换下一首
  - [x] 播放列表
  - [x] MV播放
- [x] 音乐展示
  - [x] 首页Banner
  - [x] 推荐歌单
  - [x] 发现歌单
  - [x] 精选歌单
  - [x] 推荐MV
  - [x] 全部MV
  - [x] 最新音乐
- [x] 搜索
  - [x] 热搜榜
  - [x] 搜索建议
  - [x] 模糊搜索
  - [x] 搜索历史
- [x] 详情展示
  - [x] 歌单/专辑/歌手详情
  - [x] 相似歌单/歌手/MV
  - [x] 评论展示
- [ ] 歌词滚动


## 📣结语
本项目音视频文件来自各网站接口，不会修改任何音视频文件。

本项目仅为个人前端练手项目。本站音频版权来自各网站，只提供数据查询服务，不提供任何音频存储和贩卖服务。

请勿用作商业用途，请勿通过本项目下载盗版歌曲资源，否则后果自负！

**正常使用请选择[网易云音乐官方客户端](https://music.163.com/)**

## 📝License
[MIT](LICENSE)