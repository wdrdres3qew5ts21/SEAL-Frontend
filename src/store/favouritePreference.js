import axios from 'axios'
export const favouritePreference = {
  state: {
    favorite: [],
    totalNotification: 0
  },
  actions: {
    setFavorite: function ({ commit }, favorite) {
      commit('setFavorite', favorite)
    },
    addFavoriteSubjectName: function ({ commit }, favorite) {
      commit('addFavoriteSubjectName', favorite)
    },
    deductNotification: function ({ commit }) {
      commit('deductNotification')
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
        if (favorites[i].isSomeThingUpdate === true) {
          state.totalNotification++
        }
      }
      state.favorite = favorites
    },
    addFavoriteSubjectName: function (state, favorite) {
      state.favorite.push({
        ...favorite
      })
    },
    deductNotification: function (state) {
      state.totalNotification--
    }
  },
  getters: {
    getFavorite: function (state) {
      return state.favorite
    },
    getTotalNotification: function (state) {
      return state.totalNotification
    }
  }
}
