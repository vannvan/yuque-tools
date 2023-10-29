import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-32.png',
    128: 'img/logo-128.png',
  },
  // action: {
  //   default_popup: 'popup.html',
  //   default_icon: 'img/logo-32.png',
  // },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      // matches: ['http://*/*', 'https://*/*'],
      matches: ['*://*.yuque.com/*'],
      js: ['src/contentScript/index.tsx'],
      run_at: 'document_end',
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-32.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage'],
})
