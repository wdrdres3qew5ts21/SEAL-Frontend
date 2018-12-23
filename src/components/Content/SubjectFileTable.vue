<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Material Assets</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="subjectFiles" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.index + 1 }}</td>
        <td class="text-xs-left">
          <a :href="props.item.fileUrl">{{ convertToFileName(props.item.fileName) }}</a>
        </td>
        <td class="text-xs-left">
          {{ convertFileNameToDate(props.item.fileName) }}
        </td>
        <td class="text-xs-left layout px-0">
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="loadAllSubjectFiles">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SubjectFileTable',
  props: {
    subjectID: Number
  },
  data: () => ({
    dialog: false,
    headers: [
      { text: '#', value: 'id' },
      { text: 'Materials', value: 'Materials' },
      { text: 'Last Update', value: 'Last Update' }
    ],
    subjectFiles: [],
    editedIndex: -1
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog: function (val) {
      val || this.close()
    },
    subjectID: function () {
      this.loadAllSubjectFiles()
    }
  },
  mounted () {
    this.loadAllSubjectFiles()
  },
  methods: {
    convertToFileName: function (fileName) {
      return fileName.substr(fileName.indexOf('-') + 1)
    },
    convertFileNameToDate: function (fileName) {
      let fileTimeStamp = parseInt(fileName.substr(0, fileName.lastIndexOf('-')))
      fileTimeStamp = new Date(fileTimeStamp)
      return fileTimeStamp.toGMTString()
    },
    loadAllSubjectFiles: async function () {
      console.log(this.subjectID)
      if(isNaN(this.subjectID)){
      let subjectFiles = await axios.get(`${process.env.VUE_APP_FILE_SERVICE_URL}/files/subject/${this.subjectID}`,
          {
            headers: {
              'Authorization': localStorage.getItem('jwtToken')
            }
          }
        )
        subjectFiles = subjectFiles.data
        this.subjectFiles = subjectFiles
      }
    },
    deleteItem (item) {
      console.log('Delte Item : ')
      console.log(item)
      const index = this.subjectFiles.indexOf(item)
      this.$swal({
        title: 'ต้องการจะลบไฟล์จริงๆใช่มั้ยยย ?',
        text: `ถ้าลบ ${item.fileName} ไปแล้วไฟล์จะหายไปเลยตลอดกาลนะ TwT !`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes Delete it ! ノ ゜Д゜)ノ ︵ ┻━┻ '
      })
        .then((result) => {
          if (result.value) {
            axios.delete(`${process.env.VUE_APP_FILE_SERVICE_URL}/delete/${item.id}`, {
              headers: {
                Authorization: localStorage.getItem('jwtToken')
              }
            })
            this.subjectFiles.splice(index, 1)
            this.$swal(
              'ทำการลบไฟล์!',
              'ลบไฟล์สำเร็จแล้ว',
              'success'
            )
          }
        })
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
