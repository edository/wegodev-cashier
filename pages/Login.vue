<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark> Login </v-toolbar>
        <v-card-text>
          <v-alert v-if="isError" color="red lighten-2" dark>
            {{ $t(message) }}
          </v-alert>
          <v-form>
            <v-text-field
              name="email"
              label="Email"
              type="email"
              v-model="form.email"
            />
            <v-text-field
              name="password"
              label="Password"
              type="password"
              v-model="form.password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="onSubmit()" color="primary" :disabled="isDisabled">
            <span v-if="!isDisabled">Login</span>
            <!-- loading progress button -->
            <v-progress-circular
              v-else
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
      <p>Kamu sudah punya akun? <v-btn to="/register" plain>Register</v-btn></p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      isDisabled: false,
      isError: false,
      message: '',
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    storeWelcomeScreen() {
      localStorage.setItem('welcomeScreen', true)
    },
    onSubmit() {
      this.isDisabled = true

      this.$axios
        .$post('http://localhost:3000/auth/login', this.form)
        .then((response) => {
          this.isDisabled = false

          // store passed welcome screen
          if (!localStorage.welcomeScreen) {
            this.storeWelcomeScreen()
          }

          // console.log(response)
          // redirect to login page
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.message = error.response.data.message
          this.isError = true
          this.isDisabled = false
        })
    },
  },
}
</script>