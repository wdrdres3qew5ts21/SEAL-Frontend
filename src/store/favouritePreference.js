export const favouritePreference = {
  state: {
    favoriteSubject: []
  },
  actions: {
    addFavoriteSubject: function ({ commit }, favoriteSubject) {
      console.log('add push vuex')
      commit('addFavoriteSubject', favoriteSubject)
    }
  },
  mutations: {
    addFavoriteSubject: function (state, favoriteSubject) {
      state.favoriteSubject.push({
        ...favoriteSubject
      })
    }
  },
  getters: {
    getFavoriteSubject: function (state) {
      return state.favoriteSubject
    }
  }
}
