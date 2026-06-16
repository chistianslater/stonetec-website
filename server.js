import { createApp } from './server/index.js'

const port = process.env.PORT || 3000
createApp().listen(port, () => console.log(`stonetec server läuft auf :${port}`))
