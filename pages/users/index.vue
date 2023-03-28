<template>
  <v-row class="frame-content">
    <v-col cols="10" offset="1">
      <v-card class="my-3">
        <v-toolbar color="primary" dark>
          Users
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
        <v-card-text>
          <div class="mb-4">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
          </div>

          <v-data-table
            :headers="headers"
            :items-per-page="10"
            :server-items-length="totalData"
            :options.sync="options"
            :items="users"
            :search.sync="search"
            :footer-props="{
              itemsPerPageOptions: [10, 25, 50],
            }"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: '',
      options: {},
      totalData: 0,
      users: [],
      headers: [
        { text: '#', value: 'row', sortable: false },
        { text: 'Fullname', value: 'fullname', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Role', value: 'role', sortable: false },
      ],
      breadcrumbs: [
        {
          text: 'Users',
          disabled: true,
          to: '/users',
        },
      ],
    }
  },
  methods: {
    fetchUsers() {
      const { page, itemsPerPage } = this.options
      this.loading = true

      this.$axios
        .$get(
          `http://localhost:3000/users?page=${page}&limit=${itemsPerPage}&search=${this.search}`
        )
        .then((response) => {
          this.loading = false
          this.users = response.users.docs
          this.totalData = response.users.totalDocs

          // kalo ngga pake mongoosepaginate, pake yang dikomen bawah ini aja
          // let startItem = (page - 1) * itemsPerPage + 1
          let startItem = response.users.pagingCounter
          this.users.map((user) => (user.row = startItem++))
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchUsers()
      },
      deep: true,
    },
    search: {
      handler() {
        this.fetchUsers()
      },
    },
  },
}
</script>
