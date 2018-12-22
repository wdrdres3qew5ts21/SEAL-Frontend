<template>
<v-content>
  <v-container fluid>
    <v-container grid-list-md class="space-top">
      <v-layout v-if="isHomePage == false" row wrap flexbox>
        <v-flex>
          <h1 class="title-subject" >{{getHeaderContent}}</h1>
          <div v-if="getUser.role =='teacher' ">
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" 
              @vdropzone-success="(file, response)=>reloadSubjectFileTable(file, response)"/>
            <subject-file-table :subjectID="parseInt($route.params.subjectID)" ref="subjectFileTable"/>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-end flexbox>
        <v-flex v-for="video in videoDetails" :key="video.video_id" xs12 sm3>
          <router-link :to="`/player/${video.video_id}`" @click="testLoad()">
            <video-card
              :imgURL="video.video_thumbnail"
              :videoID="video.video_id"
              :videoDate="video.video_date"
              :teacherName="video.teacher.teacher_name"
              :subjectName="video.video_name"
            />
          </router-link>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>

  <v-dialog v-model="dialog" hide-overlay persistent width="300">
    <v-card color="black" dark>
      <v-card-text>
        Loading...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>

</v-content>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import SubjectFileTable from './SubjectFileTable'
import VideoCard from './VideoCard'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DisplayVideoList',
  components: {
    VideoCard,
    SubjectFileTable,
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      dialog: true,
      isShowMenu: false,
      videoDetails: [],
      videoUrlSample: 'https://ngelearning.sit.kmutt.ac.th/api/v0/subject/2/videos',
      subjectID: 2,
      isHomePage: false,
      dropzoneOptions: {
        url: `${process.env.VUE_APP_FILE_SERVICE_URL}/upload`,
        method: 'post',
        thumbnailWidth: 150,
        maxFilesize: 30,
        timeout: 60000,
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        },
        params: {
          subjectId: parseInt(this.$route.params.subjectID)
        }
      },
    }
  },
  mounted () {
    this.subjectID = this.$route.params.subjectID === undefined ? 2 : this.$route.params.subjectID
    this.loadSubjectTitle()
    this.loadAllVideoCard()
    console.log(this.getUser)
  },
  computed: {
    ...mapGetters(['getHeaderContent', 'getUser'])
  },
  methods: {
    ...mapActions(['setHeaderContent']),
    reloadSubjectFileTable: function(file, response){
      this.$refs.subjectFileTable.loadAllSubjectFiles()
    },
    loadSubjectTitle: function () {
      if (this.$route.path == '/') {
        this.isHomePage = true
      } else {
        console.log(this.$route.query.subjectName)
        this.setHeaderContent(this.$route.query.subjectName)
      }
      console.log(this.$route.path)
    },
    loadAllVideoCard: async function () {
      let jwtTokenLocalStorage = localStorage.getItem('jwtToken')
      let videoDetails = await axios.get(
        `${process.env.VUE_APP_VIDEO_SERVICE_URL}/subject/${this.subjectID}/videos`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtTokenLocalStorage}`
          }
        }
      ).catch((response) => {
        localStorage.removeItem('jwtToken')
        this.$swal('กรุณา login', 'หมดเวลาการใช้งาน', 'error')
        this.$router.push('/login')
      })
      videoDetails = videoDetails.data
      this.videoDetails = videoDetails
      this.dialog = false
    },
    fetchVideoById: function (videoId) {},
    testLoad: function () {}
  }
}
</script>

<style scoped>
  .v-content {
    padding-top: 0px !important;
  }

  .space-top {
    margin-top: 60px;
  }

  .title-subject {
    color: #fff;
    text-align: left;
  }
</style>
