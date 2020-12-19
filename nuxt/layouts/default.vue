<template lang="pug">
v-app
  v-app-bar(color="red darken-4 white--text" dense app)
    v-app-bar-nav-icon(color="white" @click='drawer = true')
    v-toolbar-title FirstTone Project Igniter
    v-icon(color="white") mdi-fire
  v-navigation-drawer(v-model='drawer' absolute temporary)
    v-list(nav='' dense='')
      v-list-item-group(v-model='group' active-class='red--text text--darken-4')
        nuxt-link(to="/")
          v-list-item
            v-list-item-icon
              v-icon mdi-folder-plus-outline
            v-list-item-title 新規案件プロジェクト追加
        nuxt-link(to="/bulk-create-projects")
          v-list-item
            v-list-item-icon
              v-icon mdi-expand-all
            v-list-item-title 空プロジェクト一括追加
  nuxt
</template>

<script>
export default {
  data:() => ({
    drawer: false,
    group: null,
  })
}
</script>

<style lang="stylus">
a
  text-decoration none
</style>
