<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark> Register </v-toolbar>
        <v-card-text>
          <v-form>
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
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
      <p>Kamu belum punya akun? <v-btn to="/login" plain>Login</v-btn></p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['guest'],
  head: {
    title: 'Register',
  },
  data() {
    return {
      emailExist: false,
      isDisabled: false,
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
      },
      rules: {
        // ini yang pake i18n dan objek
        fullname: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Nama lengkap' }),
        ],
        email: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+/.test(v) || 'Email invalid',
          // (v) => !!this.emailExist || 'Email already exist',
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
          .$post('/auth/register', this.form)
          .then((response) => {
            this.isDisabled = false

            // redirect to login page
            this.$router.push('/login')
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