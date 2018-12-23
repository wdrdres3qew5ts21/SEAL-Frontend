import Vue from 'vue'
import Vuex from 'vuex'
import { userDetailJWT } from './store/userDetailJWT'
import { searchKeywordByFaculty } from './store/searchKeywordByFaculty'
import { loginPreference } from './store/loginPreference'
import { headerContentPreference } from './store/headerContentPreference'
import { favouritePreference } from './store/favouritePreference'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loginPreference,
    userDetailJWT,
    searchKeywordByFaculty,
    headerContentPreference,
    favouritePreference
  }
})
