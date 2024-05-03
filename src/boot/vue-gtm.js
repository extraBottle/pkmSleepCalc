import { boot } from 'quasar/wrappers'
import { createGtm } from '@gtm-support/vue-gtm';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  // something to do
  app.use(
    createGtm({
      id: 'GTM-PLX2WXDD', // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}]      
      debug: false, // Whether or not display console logs debugs (optional)
      vueRouter: router, // Pass the router instance to automatically sync with router (optional)
    }),
  );
})
