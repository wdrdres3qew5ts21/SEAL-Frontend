<template>
  <v-app>
    <vue-snotify></vue-snotify>
    <ToolBar v-show="getIsShowToolBar" ref="toolBar"/>
    <router-view  @loadToolBarAfterLogin="loadToolBar()"></router-view>
    <v-footer color="black" app inset>
      <p class="white--text text-copyright">&copy; Seal-Learning X VueJS</p>
    </v-footer>
  </v-app>
</template>
<script>
import ToolBar from './components/Header/ToolBar'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    ToolBar
  },
  mounted () {

  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getIsShowToolBar', 'getFavorite'])
  },
  methods: {
    loadToolBar: function () {
      console.log('emit work!!!')
      this.$refs.toolBar.loadAllFaculties()
      this.$refs.toolBar.loadAllFavorite()
      this.getFavorite
    },
    snotifyToUserBySubscribe: function(subjectText){
      vm.$snotify.info('วิชา Cloud Native มีไฟล์ใหม่', `New Material !`, {
        timeout: 7000,
        closeOnClick: true,
        pauseOnHover: true,
        titleMaxLength: 40,
        bodyMaxLength: 60
      })
    }
  }
}
</script>
<style>
a {
  text-decoration: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #191919;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.text-copyright {
  margin: 0px;
  position: absolute;
  right: 10px;
}
</style>
