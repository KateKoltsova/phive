import { createApp } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import store from '~/store'
import router from '~/router'
import App from '~/components/App'
// import Snackbar from 'vuejs-snackbar'
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";


// import LogRocket from 'logrocket'
// import VueInputDropdown from 'vue-input-dropdown'
import vueDebounce from 'vue-debounce'
import VueContentPlaceholders from 'vue-content-placeholders'
import VueExpandableImage from 'vue-expandable-image'
import Vue2TouchEvents from 'vue2-touch-events'
import VueSocialSharing from 'vue-social-sharing'
import Paginate from 'vuejs-paginate'

import '~/plugins'
import '~/components'

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js')

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: process.env.MIX_PUSHER_APP_KEY,
//   cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//   encrypted: false
// })

// LogRocket.init('i0tmx9/phive')

const breakpoints = {
  xs: '360px',
  sm: '410px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  xxl: '1366px'
}

const VueScrollTo = require('vue-scrollto')

const Vue = createApp(App)
Vue.use(store)
Vue.use(router)

Vue.use(VueScrollTo, {
  easing: 'ease-in-out',
  duration: 60,
  offset: -60,
  force: true,
  cancelable: true
})
Vue.use(VueSocialSharing)
Vue.use(Vue2TouchEvents)
Vue.use(VueContentPlaceholders)
Vue.use(VueExpandableImage)
Vue.use(vueDebounce)

Vue.config.globalProperties.$matchMedia = {
  isXs: useMediaQuery(`(min-width: ${breakpoints.xs})`),
  isSm: useMediaQuery(`(min-width: ${breakpoints.sm})`),
  isMd: useMediaQuery(`(min-width: ${breakpoints.md})`),
  isLg: useMediaQuery(`(min-width: ${breakpoints.lg})`),
  isXl: useMediaQuery(`(min-width: ${breakpoints.xl})`),
  isXxl: useMediaQuery(`(min-width: ${breakpoints.xxl})`)
}

Vue.component('snackbar', SnackbarService)
// Vue.use(SnackbarService);
Vue.component('paginate', Paginate)


Vue.config.compilerOptions = {
  compatConfig: {
    MODE: 2,
    RENDER_FUNCTION: false,
  },
};

Vue.mount('#app')
