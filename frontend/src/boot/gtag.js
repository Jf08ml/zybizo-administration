import { boot } from 'quasar/wrappers'
import { createGtag } from 'vue-gtag-next'

export default boot(({ app }) => {
  const gtag = createGtag({
    property: {
      id: 'G-7VW8DTFWVX'
    }
  })
  
  app.use(gtag)
})

