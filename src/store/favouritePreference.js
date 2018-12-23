import axios from 'axios'
import Vue from 'vue'
export const favouritePreference = {
  state: {
    favorites: [],
    totalNotification: 0,
    isVisitFirstTime: true,
    vm: new Vue()
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
          if (state.isVisitFirstTime) {
            state.vm.$snotify.info(`วิชา ${favorites[i].subjectName} มีไฟล์ใหม่`, 'New Material !', {
              timeout: 7000,
              closeOnClick: true,
              pauseOnHover: true,
              titleMaxLength: 40,
              bodyMaxLength: 80
            })
          }
        }
      }
      state.isVisitFirstTime = false
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
