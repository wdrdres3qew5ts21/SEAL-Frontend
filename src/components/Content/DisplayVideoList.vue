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
            <subject-file-table :subjectID="parseInt(this.$route.params.subjectID)" ref="subjectFileTable"/>
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
        },
        dictDefaultMessage: "<img src='https://png.pngtree.com/svg/20170414/file_upload_8845.png' style='width: 10%' />"+
                            "<h3>( ͡° ͜ʖ ͡°) Upload File Here Drag & Drop</h3>"
      }
    }
  },
  watch: {
    '$route.params.subjectID': function () {
      this.fetchAllVideoDetailForThisSubject()
    }
  },
  mounted () {
    this.fetchAllVideoDetailForThisSubject()
  },
  computed: {
    ...mapGetters(['getHeaderContent', 'getUser', 'getFavorite'])
  },
  methods: {
    ...mapActions(['setHeaderContent', 'modifyFavorite', 'deductNotification']),
    fetchAllVideoDetailForThisSubject: function () {
      // ถ้าเกิดไม่กรอก subjectID ของหน้าวิชามาก็จะเตะไปวิชาที่ตั้งไว้คือ IT fund มี subjectID คือ 2
      this.subjectID = this.$route.params.subjectID === undefined ? 2 : this.$route.params.subjectID
      this.loadSubjectTitle()
      this.loadAllVideoCard()
    },
    reloadSubjectFileTable: function (file, response) {
      this.$refs.subjectFileTable.loadAllSubjectFiles()
      axios.put(`${process.env.VUE_APP_USER_SERVICE_URL}/subject/${this.subjectID}/updatefile`, null,
        {
          headers: {
            Authorization: localStorage.getItem('jwtToken')
          }
        })
    },
    loadSubjectTitle: async function () {
      if (this.$route.path == '/') {
        this.isHomePage = true
      } else {
        // เข้ามาตรงนี้แสดงว่าไม่ใช่หน้า HomePage แต่เป็นหน้ารายวิชาของภาคตัวเอง
        console.log(this.$route.query.subjectName)
        this.setHeaderContent(this.$route.query.subjectName)
        // เข้ามาที่ภาคตัวเองหลังจากเห็นไปแล้วว่าอยู่หน้าวิชาใดต่อไปก็คือการเซ็ท Notification ว่ามีอะไรใหม่เป็น False
        // console.log(this.getFavoriteBySubjectId(this.$route.params.subjectID))
        console.log(this.getFavorite)
        let subjectIdOfPage = this.$route.params.subjectID
        let favoriteLists = this.getFavorite
        let myFavoriteId = null
        for (let i = 0; i < favoriteLists.length; i++) {
          if (favoriteLists[i].subjectId === subjectIdOfPage) {
            myFavoriteId = favoriteLists[i].id
            break
          }
        }
        this.userReadNotificationFromFavoriteSubject(myFavoriteId)
      }
      // console.log(this.$route.path)
    },
    userReadNotificationFromFavoriteSubject: function(userFavoriteId){
      if (userFavoriteId != null) {
          // console.log('You had favourite this subject : '+ myFavoriteId)
          axios.put(`${process.env.VUE_APP_USER_SERVICE_URL}/user/${this.getUser.userId}/read/notification`, {
            id: userFavoriteId
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          })
        }
        // ทำการจัดการ Notification Toolbar ใหม่หลังจากจัดการกับ Backend สำเร็จแล้ว
        let favoriteLists = this.getFavorite
        for(let i=0; i< favoriteLists.length; i++){
          if(favoriteLists[i].subjectId == this.subjectID){
            favoriteLists[i].isSomeThingUpdate = false
            this.modifyFavorite(favoriteLists)
            this.deductNotification()
            break
          }
        }
    },
    loadAllVideoCard: async function () {
      console.log('load all video card')
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
    }
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
