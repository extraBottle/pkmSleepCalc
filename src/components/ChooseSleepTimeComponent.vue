<template>
  <q-toolbar class="bg-primary text-white text-center">
    <q-toolbar-title>수면 시간 입력</q-toolbar-title>
  </q-toolbar>
  <div class="column items-center">
    <q-img
      alt="Pokemon sleeping image"
      :src="selectPkmImage"
      style="max-width: 300px">
      <template v-slot:loading>
        <q-spinner-hourglass
          color="primary"
        />
      </template>
    </q-img>
    <q-time
      v-model="sleepTime"
      :options="overOneHour"
      format24h
    />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useDownloadStore } from 'src/stores/downloadStore'
import { useInputStore, useSleepTimeInputStore } from 'src/stores/inputStore'

defineOptions({
  name: 'ChooseSleepTimeComponent'
})

onBeforeUnmount(()=>{
  mySleepTimeInputStore.sleepTime = sleepTime.value
})

const myDownloadStore = useDownloadStore()
const myInputStore = useInputStore()
const mySleepTimeInputStore = useSleepTimeInputStore()
const selectPkmImage = ref(myDownloadStore.fetchImage('sleep', myInputStore.selectedPkmDex))
// 총 수면시간
const sleepTime = ref(mySleepTimeInputStore.sleepTime)
const overOneHour = (hr) => hr > 1 && hr < 12

</script>
