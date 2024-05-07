<template>
  <q-item
    clickable
    :to="routeName"
    @click="triggerEvent('enter_calc_from_menu')"
  >
    <q-item-section
      v-if="props.meta.icon"
      avatar
    >
      <q-avatar>
        <img :src="props.meta.icon">
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.meta.title }}</q-item-label>
      <q-item-label caption>{{ props.meta.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { triggerEvent } from 'src/utils/gtmAddEvent';

defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  name: {
    type: String,
    default: '포슬립 계산기 허브'
  },

  meta: {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
})
const routeName = { name: props.name }
</script>
