<template>
  <router-view />
</template>

<script setup>
import { stopLoading } from './utils/loading'
import { popupFail } from './utils/popup'
import { useRoute ,useRouter } from 'vue-router';
import { ref, onErrorCaptured } from 'vue';
import { useMeta } from 'quasar';
defineOptions({
  name: 'App'
});

const route = useRoute()

// 오류 발생시 메인화면으로 보냄
const router = useRouter()
onErrorCaptured(()=>{
  stopLoading()
  router.push('/')
  popupFail('오류가 발생했습니다')
})

const isMaintenance = true;

if (isMaintenance && route.path !== '/maintenance') {
  router.push('/maintenance');
}

// dynamic meta tag
useMeta(()=>{
  const pageName = ref(route.name)
  const desc = ref(route.meta.help)
  return {
    title: pageName.value,
    titleTemplate: title => `${title} - 포켓몬 슬립`,     
    meta: {
      description: { name: 'description', content: desc.value }
    }
  }
})
</script>
