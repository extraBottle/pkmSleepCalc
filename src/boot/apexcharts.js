import VueApexCharts from 'vue3-apexcharts';
import { boot } from 'quasar/wrappers';

export default (({ app }) => {
    app.use(VueApexCharts)
})
// import VueApexCharts from "vue3-apexcharts";
// import { createApp } from 'vue';

// const app = createApp(App);
// app.use(VueApexCharts);
// The app.use(VueApexCharts) will make <apexchart> component available everywhere.