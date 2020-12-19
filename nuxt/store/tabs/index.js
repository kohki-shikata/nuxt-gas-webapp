export const state = () => ({
  tab: 'backlog-basics'
})

export const mutations = {
  update(state, tab) {
    state.tab = tab
  }
}

export const getters = {
  tab: state => state.tab
}

export const actions = {
  update(ctx, id) {
    ctx.commit('update', id)
  }
}
