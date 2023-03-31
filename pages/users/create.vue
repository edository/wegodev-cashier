<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark> Create User </v-toolbar>
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
          <v-form ref="form">
            <v-text-field
              name="fullname"
              label="Full Name"
              type="text"
              v-model="form.fullname"
              :rules="rules.fullname"
            />
            <v-text-field
              name="email"
              label="Email"
              type="email"
              v-model="form.email"
              :rules="rules.email"
              @keydown="checkEmailExist"
            />
            <v-text-field
              name="password"
              label="Password"
              type="password"
              v-model="form.password"
              :rules="rules.password"
            />
            <v-text-field
              name="retype_password"
              label="Re-Password"
              type="password"
              v-model="form.retype_password"
              :rules="rules.retype_password"
            />
            <v-select
              v-model="form.role"
              :items="roles"
              label="Role"
              :rules="rules.role"
            >
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="onSubmit()"
            color="primary"
            :disabled="isDisabled"
            :loading="isDisabled"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['authenticated'],
  head: {
    title: 'Create User',
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Users', disabled: false, to: '/users', exact: true },
        { text: 'Create', disabled: true },
      ],
      emailExist: false,
      isDisabled: false,
      roles: ['employee', 'cashier', 'admin'],
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
        role: '',
      },
      rules: {
        // ini yang pake i18n dan objek
        fullname: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Nama lengkap' }),
        ],
        email: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+/.test(v) || 'Email invalid',
          (v) => !this.emailExist || 'Email already exist',
        ],
        password: [
          (v) => !!v || 'Password is required',
          (v) =>
            v.length >= 6 ||
            this.$t('FIELD_MIN', { field: 'Password', min: 6 }),
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            this.$t('FIELD_NOT_MATCH', {
              field: 'Password',
              match: 'Re-Password',
            }),
        ],
        role: [(v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Role' })],
      },
    }
  },
  methods: {
    checkEmailExist() {
      this.emailExist = false
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true

        this.$axios
          .$post('/users', this.form)
          .then((response) => {
            this.isDisabled = false

            // redirect to users page
            this.$router.push({
              name: 'users___' + this.$i18n.locale,
              params: { message: 'USER_CREATED', fullname: this.form.fullname },
            })
          })
          .catch((error) => {
            if (error.response.data.message == 'EMAIL_EXIST') {
              this.emailExist = true

              // ini digunakan karena bug vuetify validasi rules email exist
              // digunakan bersamaan dengan v-form ref="form"
              this.$refs.form.validate()
            }
            this.isDisabled = false
          })
      }
    },
  },
}
</script>