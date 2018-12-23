import axios from 'axios'
export const favouritePreference = {
  state: {
    favorite: []
  },
  actions: {
    setFavorite: function ({ commit }, favorite) {
      commit('setFavorite', favorite)
    },
    addFavoriteSubjectName: function ({ commit }, favorite) {
      commit('addFavoriteSubjectName', favorite)
    }
  },
  mutations: {
    setFavorite: async function (state, favorites) {
      let jwtTokenLocalStorage = localStorage.getItem('jwtToken')
      for (let i = 0; i < favorites.length; i++) {
        let subject = await axios.get(
          `${process.env.VUE_APP_PROGRAM_SERVICE_URL}/subject/${favorites[i].subjectId}`, {
            headers: {
              'Authorization': `Bearer ${jwtTokenLocalStorage}`
            }
          })
        favorites[i].subjectName = subject.data.subject_name
      }
      state.favorite = favorites
    },
    addFavoriteSubjectName: function (state, favorite) {
      state.favorite.push({
        ...favorite
      })
    }
  },
  getters: {
    getFavorite: function (state) {
      return state.favorite
    }
  }
}
