<template>
  <q-item
    clickable
    :to="routeName"
    @click="triggerEvent('enter_calc_from_menu')"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-avatar>
        <img :src="props.icon">
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { triggerEvent } from 'src/utils/gtmAddEvent';

defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  name: {
    type: String,
    default: '포슬립 계산기 허브'
  },

  icon: {
    type: String,
    default: ''
  }
})
const routeName = { name: props.name }
</script>
