const fs = require('fs')
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  server: {
    port: 3000,
    host: 'localhost'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Righteous' }
    ],
    script: [
      { src: 'https://buttons.github.io/buttons.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/filters.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    ['nuxt-buefy', {
      css: true,
      materialDesignIcons: false
    }],
    ['@nuxtjs/google-analytics', {
      id: 'UA-136123372-1'
    }],
    '@nuxtjs/sitemap'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  sitemap: {
    generate: true,
    hostname: 'https://toolkit.now.sh',
    filter ({ routes }) {
      return routes.map(function (route) {
        route.url = `${route.url}/`
        return route
      })
    }
  },
  watch: ['./pages/*/config.json'],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    analyze: false,
    splitChunks: {
      layouts: false,
      pages: true,
      commons: true
    },
    extend (config, ctx) {
      // Transform all pages/*/config.json into tools.json
      if (ctx.isServer) {
        const files = fs.readdirSync('./pages/')
        var tools = []
        for (let i = 0; i < files.length; i++) {
          try {
            const file = fs.readFileSync(`./pages/${files[i]}/config.json`, 'utf8')
            const meta = fs.statSync(`./pages/${files[i]}/index.vue`)
            const config = JSON.parse(file)
            config.created = meta.birthtime
            config.modified = meta.mtime
            tools.push(config)
          } catch (err) {
          }
        }
        fs.writeFileSync('./tools.json', JSON.stringify(tools))
      }
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
