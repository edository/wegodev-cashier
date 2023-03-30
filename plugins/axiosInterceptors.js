export default function({ $axios, store, redirect }) {
    $axios.onRequest((config) => {
        if (store.getters['auth/authenticated']) {
            config.headers['Authorization'] = `Bearer ${store.state.auth.access_token}`
        }
    })

    $axios.onResponseError(error => {
        if (error.response.status === 401) {
            return $axios.$post('auth/refresh-token', { refresh_token: store.state.auth.refresh_token })
                        .then(response => {
                            console.log(response)
                            store.commit('auth/setAccessToken', response.access_token)
                            store.commit('auth/setRefreshToken', response.refresh_token)

                            const originalRequest = error.config
                            originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`
                            return $axios(originalRequest)
                        })
                        .catch(error => {
                            if (error.response.data.message === 'REFRESH_TOKEN_EXPIRED' || error.response.data.message === 'REFRESH_TOKEN_INVALID') {
                                store.commit('auth/logout')
                                return redirect('/login')
                            }
                        })
        }
    })
}