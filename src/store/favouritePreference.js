import axios from 'axios'
export const favouritePreference = {
  state: {
    favorites: [],
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
    },
    modifyFavorite: function ({ commit }, favorite) {
      commit('modifyFavorite', favorite)
    }
  },
  mutations: {
    modifyFavorite: function (state, favorite) {
      state.favorites = favorite
    },
    setFavorite: async function (state, favorites) {
      state.totalNotification = 0
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
      state.favorites = favorites
    },
    addFavoriteSubjectName: function (state, favorite) {
      state.favorites.push({
        ...favorite
      })
    },
    deductNotification: function (state) {
      state.totalNotification--
    }
  },
  getters: {
    getFavorite: function (state) {
      return state.favorites
    },
    getTotalNotification: function (state) {
      return state.totalNotification
    }
  }
}
