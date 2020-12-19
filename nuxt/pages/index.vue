<template lang="pug">
v-container(style="min-height: 100vh").text-left
  v-row
    v-col(col="12")
      h2.heading-2 新規案件プロジェクトを設定します
      tabs
      v-tabs-items(v-model="tab")
        v-tab-item(value="backlog-basics")
          backlogProjectBasic
        v-tab-item(value="backlog-tasks")
          h3.heading-3 初期設定タスク
            .task-button
              v-btn(icon color="blue" @click="addFirstTask()" v-if="presetTasksMovie.length === 0")
                v-icon mdi-plus
              v-dialog(v-model="allClearFlag" width="500" v-else)
                template(v-slot:activator="{ on, attrs }")
                  v-btn(text color="red" @click="allClearFlag = true")
                    v-icon mdi-close
                    |全て削除
                v-card
                  v-card-title.headline.red.lighten-2 全ての課題を削除します
                  v-card-text
                    |全ての課題を削除します。この操作は取り消しできません。本当に削除してよろしいですか？
                  v-divider
                  v-card-actions
                    v-spacer
                    v-btn(color="red" text @click="allClearFlag = false") キャンセル
                    v-btn(color="green" text @click="removeTasksAll()") はい、全て削除します
          draggable(v-model="presetTasksMovie" tag="div" handle=".handle")
            template(v-for="(item, index) in presetTasksMovie")
              v-row
                v-col(cols="1").handle
                  span ({{ index + 1 }})
                  v-icon mdi-dots-vertical
                v-col(cols="11")
                  v-row
                    v-col(cols="12" md="6")
                      v-text-field(v-model="item.summary" outlined :key="index").task
                        template(v-slot:append)
                          v-dialog(v-model="taskDialogFlags[index].dialog" width="500")
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(@click="removeTask(index)" icon color="red")
                                v-icon mdi-close
                            v-card
                              v-card-title.headline.red.lighten-2 この操作は取り消しできません
                              v-card-text
                                |「({{ index + 1 }}) {{ item.summary }}」を削除します。この操作は取り消しできません。本当に削除してよろしいですか？
                              v-divider
                              v-card-actions
                                v-spacer
                                v-btn(color="red" text @click="taskDialogFlags[index].dialog = false") キャンセル
                                v-btn(color="green" text @click="removeTaskImmidiately(index)") はい、削除します
                          v-btn(@click="addTask(index)" icon color="blue")
                            v-icon mdi-plus
                    v-col(cols="12" md="3")
                      date-picker(v-model="item.selectedDate" is-range)
                        template(v-slot="{ inputValue, inputEvents }")
                          template(v-if="inputValue.start === null && inputValue.end === null")
                            v-text-field(outlined label="開始日と終了日" value="" v-on="inputEvents.start")
                          template(v-else)
                            v-text-field(outlined label="開始日と終了日" :value="inputValue.start + '→' + inputValue.end" v-on="inputEvents.start")
                    v-col(cols="12" md="3")
                      v-select(:items="FTUserNameOnly()" outlined label="担当者")
        v-tab-item(value="backlog-wiki")
          h2.heading-2 Backlog Wiki初期設定
        v-tab-item(value="chatwork")
          h2.heading-2 Chatworkグループ設定
          pre
            |{{ $data }}

</template>

<script>
import draggable from 'vuedraggable'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

import tabs from '@/components/init-projects/tabs.vue'
import backlogProjectBasic from '@/components/init-projects/backlog-project-basic.vue'


export default {
  components: {
    tabs,
    draggable,
    DatePicker,
    backlogProjectBasic
  },
  data: () => ({
    ftUserList: [],
    presetTasksMovie: [],
    taskDialogFlags: [],
    allClearFlag: false,
    startDateMenuFlags: [],
    chatworkInitFlag: true,
  }),
  computed: {
    tab: {
      get() {
        return this.$store.getters['tabs/tab']
      },
      set(value) {
        this.$store.commit('tabs/update', value)
      }
    }
  },
  methods: {

    setPresetTasksMovie() {
      // google.script.run
      //   .withSuccessHandler((res) => {
      //     this.presetTasksMovie = res
      //     console.log(res)
      //     this.createTaskDialogFlags()
      //   })
      //   .getPresetTasksMovie()
    },
    getFTUsers() {
      // google.script.run
      //   .withSuccessHandler((res) => {
      //     this.ftUserList = res
      //     console.log(res)
      //     this.createTaskDialogFlags()
      //   })
      //   .getFtUserList()
    },
    FTUserNameOnly() {
      return _.map(this.ftUserList, 'name')
    },
    removeTask(index) {
      if(String(this.presetTasksMovie[index].summary).length === 0) {
        this.removeTaskImmidiately()
      } else {
        this.taskDialogFlags[index].dialog = true
      }
    },
    removeTaskImmidiately(index) {
      this.presetTasksMovie.splice(index, 1),
      this.taskDialogFlags.splice(index, 1)
    },
    addTask(index) {
      this.presetTasksMovie.splice(index + 1, 0, {
        summary: '',
        priorityId: 3,
        startDate: '',
        endDate: ''
      })
      this.taskDialogFlags.push({ dialog: false })
    },
    addFirstTask() {
      this.presetTasksMovie = []
      this.presetTasksMovie.push({
        summary: '',
        priorityId: 3,
        startDate: '',
        endDate: ''
      })
      this.taskDialogFlags = []
      this.taskDialogFlags.push({ dialog: false })
    },
    removeTasksAll() {
      this.presetTasksMovie = []
      this.allClearFlag = false
    },
    createTaskDialogFlags() {
      for(const item of this.presetTasksMovie) {
        this.taskDialogFlags.push({ dialog: false })
      }
      console.log(this.taskDialogFlags)
    },
    createStartDateMenuFlags() {
      for(const item of this.presetTasksMovie) {
        this.startDateMenuFlags.push({ dialog: false })
      }
    }
  },
  mounted() {
    this.setPresetTasksMovie()
    this.getFTUsers()
    this.createTaskDialogFlags()
    this.createStartDateMenuFlags()
  }
}
</script>

<style lang="stylus">
#app
  padding-top 48px
.task
  .v-input__append-inner
    margin-top calc(17px / 2) !important
.heading-2
  font-size 22px
  margin-bottom .5em
.heading-3
  font-size 18px
.handle
  cursor pointer
  &:hover
    background rgba(25,25,25,.25)
.v-dialog>.v-card>.v-card__title
  margin-bottom 1em
.task-button
  display: inline-block;
  top: -2px;
  position: relative;
</style>
