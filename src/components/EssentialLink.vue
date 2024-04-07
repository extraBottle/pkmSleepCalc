<template>
  <q-item
    clickable
    tag="a"
    :target="whereTab"
    :href="props.link"
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

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  }
})
const whereTab = props.link.includes('/pkmSleepCalc/') ? '_self' : '_blank'
</script>
