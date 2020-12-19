<template lang="pug">
div.backlog-project-basic
  h3.heading-3 基本情報
  v-row(style="margin-bottom: 30px")
    v-col(cols="12" md="8")
      v-text-field(v-model="projectTitle" outlined label="プロジェクト名")
    v-col(cols="12" md="4")
      v-text-field(v-model="projectKey" outlined label="プロジェクトキー" @keyup="searchKey()")
    v-col(cols="12")
      v-alert(dense border="left" type="warning" v-if="checkKey === true") {{ projectKey }}は、既に使われているプロジェクトキーです。他のプロジェクトキーを入力してください。
  v-row
    v-col(cols="12" md="6")
      h3.heading-3 種別の作成
        .task-button
          v-dialog(v-model="allClearTypesFlag" width="500" v-if="types.length >= 1")
            template(v-slot:activator="{ on, attrs }")
              v-btn(text color="red" @click="allClearTypesFlag = true")
                v-icon mdi-close
                |全て削除
            v-card
              v-card-title.headline.red.lighten-2 全ての種別を削除します
              v-card-text
                |全ての種別を削除します。この操作は取り消しできません。本当に削除してよろしいですか？
              v-divider
              v-card-actions
                v-spacer
                v-btn(color="red" text @click="cancelAllTypes()") キャンセル
                v-btn(color="green" text @click="removeTypesAll()") はい、全て削除します
      v-checkbox(v-model="typeFormatFlag" color="warning" label="Backlogデフォルトの種別を全部削除して新規に種別を作成する" @change="initType()")
      draggable(v-model="types" tag="div" handle=".handle")
        template(v-for="(item, index) in types")
          v-row
            v-col(cols="1").handle
              span ({{ index + 1 }})
              v-icon mdi-dots-vertical
            v-col(cols="11")
              v-row
                v-col(cols="12")
                  v-row
                    v-col(cols="1")
                      v-swatches(v-model="color[index]" :swatches="swatches" row-length="5" shapes="circles" show-border popover-x="right")
                    v-col(cols="11")
                      v-text-field(v-model="item.name" outlined :key="index").type
                        template(v-slot:append class="mt-0")
                          v-dialog(v-model="typeDialogFlags[index].dialog" width="500")
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(@click="removeType(index)" icon color="red")
                                v-icon mdi-close
                            v-card
                              v-card-title.headline.red.lighten-2 この操作は取り消しできません
                              v-card-text
                                |「({{ index + 1 }}) {{ item.name }}」を削除します。この操作は取り消しできません。本当に削除してよろしいですか？
                              v-divider
                              v-card-actions
                                v-spacer
                                v-btn(color="red" text @click="typeDialogFlags[index].dialog = false") キャンセル
                                v-btn(color="green" text @click="removeTypeImmidiately(index)") はい、削除します
                          v-btn(@click="addType(index)" icon color="blue")
                            v-icon mdi-plus
    v-col(cols="12" md="6")
      h3.heading-3 カテゴリの作成
      v-checkbox(v-model="categoryFormatFlag" color="warning" label="Backlogデフォルトのカテゴリーを全部削除して新規に種別を作成する")
</template>

<script>

import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data: () => ({
    projectKey: '',
    projectTitle: '',
    keyList: [],
    checkKey: false,
    typeFormatFlag: false,
    categoryFormatFlag: false,
    typeDialogFlags: [],
    types: [],
    color: [],
    swatches: [
      "#e30000",
      "#990000",
      "#934981",
      "#814fbc",
      "#2779ca",
      "#007e9a",
      "#7ea800",
      "#ff9200",
      "#ff3265",
      "#666665",
    ],
    allClearTypesFlag: false,
    categories: [],
  }),
  methods: {
    getProjectKeys() {
      // google.script.run
      //   .withSuccessHandler((res) => {
      //     this.keyList = res
      //     console.log(res)
      //   })
      //   .withFailureHandler((err) => {
      //     console.log(err)
      //   })
      //   .getProjectKeyList()
    },
    searchKey() {
      const comparison = this.projectKey
      if(_.find(this.keyList, function(o) { return o === comparison })) {
        this.checkKey = true
      } else {
        this.checkKey = false
      }
    },
    addFirstType() {
      this.types.push({
        name: '',
        color: ''
      })
      this.color.push('#e30000')
      this.addTypeDialogFlag()
    },
    addType(index) {
      this.types.splice(index + 1, 0, {
        name: '',
        color: ''
      })
      this.typeDialogFlags.splice(index + 1, 0 , { dialog: false })
      this.color.splice(index + 1, 0, '#e30000')
    },
    addTypeDialogFlag() {
      this.typeDialogFlags.push({ dialog: false })
      console.log(this.typeDialogFlags)
    },
    removeType(index) {
      if(String(this.types[index].name).length === 0) {
        this.removeTypeImmidiately()
      } else {
        this.typeDialogFlags[index].dialog = true
      }
      if(this.types.length === 0) {
        this.typeFormatFlag = false
      }
    },
    removeTypeImmidiately(index) {
      this.types.splice(index, 1),
      this.color.splice(index, 1),
      this.typeDialogFlags.splice(index, 1)
    },
    removeTypesAll() {
      this.types = []
      this.color = []
      this.allClearTypesFlag = false
      this.typeFormatFlag = false
    },
    initType() {
      if(this.types.length === 0) {
        this.addFirstType()
      } else {
        this.allClearTypesFlag = true
      }
    },
    cancelAllTypes() {
      this.allClearTypesFlag = false
      this.typeFormatFlag = true
    }
  },
  mounted() {
    this.getProjectKeys()
  }
}
</script>

<style lang="stylus">
.v-window
  overflow visible !important
.backlog-project-basic
  .v-input--is-label-active
    .v-input__slot
      border 1px solid #FF3D00
      background #FFF59D
      padding .5em

</style>
