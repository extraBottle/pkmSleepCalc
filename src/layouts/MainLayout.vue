<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          포켓몬 슬립 생산량 계산기
        </q-toolbar-title>

        <div>v{{ myVersion }}<br>@두번째유리병</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="background-color: bisque;"
    >
      <q-list>
        <q-item-label
          header
          style="background-color: antiquewhite;"
        >
          이런 것도 있어요
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          style="border-bottom: dotted;"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import VersionInfo from '../../package.json'

defineOptions({
  name: 'MainLayout'
})

const myVersion = VersionInfo.version
const linksList = [
  {
    title: 'exp 계산기',
    caption: '렙업에 필요한 사탕 & 꿈조량을 알아보세요',
    icon: 'images/pikachucandy.png',
    link: 'https://extrabottle.github.io/pkmSleepExpCalc/'
  },
  {
    title: '이브이 최적 진화 찾기',
    caption: '이브이 진로상담 해드립니다',
    icon: 'images/eeveeLink.png',
    link: 'https://extrabottle.github.io/pkmSleepEevelution/'
  },
  {
    title: '식재료 생산량 계산기',
    caption: '내 포켓몬은 식재료를 얼마나 모아올까?',
    icon: 'images/fancyapple.png',
    link: 'https://extrabottle.github.io/pkmSleepCalc/'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
