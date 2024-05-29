<template>
  <div id="app">
    <!-- <loading ref="loading" /> -->
    <div v-if="!matchMedia.xl">
      <snackbar ref="snackbar" base-size="10rem" position="bottom" :hold-time="5000" :multiple="false" />
    </div>
    <div v-else>
      <snackbar ref="snackbar" base-size="10rem" style="font-size:1.24rem;top:10%;right:7%;" position="top-right" :hold-time="5000" :multiple="false" />
    </div>
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" />
    </transition>
  </div>
</template>

<script>
// import Loading from './Loading'
import { loadProgressBar } from 'axios-progress-bar'
import { defineComponent } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import SnackbarService from 'vue3-snackbar';

loadProgressBar()

const requireContext = require.context('~/layouts', false, /.*\.vue$/)

const layouts = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
  )
  .reduce((components, [name, component]) => {
    components[name] = component.default || component
    return components
  }, {})

export default {
  el: '#app',

  data: () => ({
    layout: null,
    defaultLayout: 'default'
  }),

  metaInfo () {
    const appName = 'PHive'

    return {
      title: appName,
      titleTemplate: `%s · ${appName}`
    }
  },

  mounted () {
    this.$store.dispatch('notification/attachSnackbar', {
      snackbar: this.$refs.snackbar
    })
  },

  methods: {
    setLayout(layout) {
      if (!layout || !this.layouts[layout]) {
        layout = this.defaultLayout;
      }
      this.layout = this.layouts[layout];
    }
  },

  setup() {
    const breakpoints = {
      xs: '360px',
      sm: '410px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      xxl: '1366px'
    };

    const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);

    return {
      matchMedia: {
        xl: isXl
      }
    };
  },

  components: {
    snackbar: SnackbarService
  },

};
</script>
