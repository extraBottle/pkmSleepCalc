<template>
  <router-view />
</template>

<script setup>
import { stopLoading } from './utils/loading'
import { popupFail } from './utils/popup'
import { useRouter } from 'vue-router';
import { onErrorCaptured } from 'vue';
defineOptions({
  name: 'App'
});

const router = useRouter()
onErrorCaptured(()=>{
  stopLoading()
  router.push('/')
  popupFail('오류가 발생했습니다')
})
</script>
