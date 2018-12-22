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

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="subjectFiles"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.index + 1 }}</td>
        <td class="text-xs-left">
          <a :href="props.item.fileUrl">{{ convertToFileName(props.item.fileName) }}</a>
        </td>
        <td class="text-xs-left">
          {{ convertFileNameToDate(props.item.fileName) }}
        </td>
        <!-- <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td> -->
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
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    this.loadAllSubjectFiles()
  },
  methods: {
    convertToFileName: function(fileName){
      return fileName.substr(fileName.indexOf("-")+1)
    },
    convertFileNameToDate: function(fileName){
      let fileTimeStamp = parseInt(fileName.substr(0,fileName.lastIndexOf("-"))) 
      fileTimeStamp = new Date(fileTimeStamp)
      return fileTimeStamp.toDateString()
    },
    loadAllSubjectFiles: async function () {
      let subjectFiles = await axios.get(`${process.env.VUE_APP_FILE_SERVICE_URL}/files/subject/${this.subjectID}`)
      subjectFiles = subjectFiles.data
      this.subjectFiles = subjectFiles
      console.log(subjectFiles)
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
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
