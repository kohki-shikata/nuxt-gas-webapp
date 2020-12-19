<template lang="pug">
div
  v-tabs(v-model="tab" background-color="lime lighten-4" centered icons-and-text color="green--text text--darken-4" style="margin-bottom: 30px")
    v-tabs-slider
    v-tab(href="#backlog-basics")
      |Backlog基本設定
      v-icon mdi-cog
    v-tab(href="#backlog-tasks")
      |Backlog初期課題設定
      v-icon mdi-file-tree
    v-tab(href="#backlog-wiki")
      |BacklogWiki初期設定
      v-icon mdi-book-open-outline
    v-tab(href="#chatwork")
      |Chatworkグループ設定
      v-icon mdi-forum
</template>

<script>
export default {
  name: 'tabs',
  computed: {
    tab: {
      get() {
        return this.$store.getters['tabs/tab']
      },
      set(value) {
        this.$store.commit('tabs/update', value)
      }
    }
  }
}
</script>
