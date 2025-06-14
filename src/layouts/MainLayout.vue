<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn
          v-if="onlySmallWindow"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"          
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ route.name }}
        </q-toolbar-title>

        <div>v{{ myVersion }}<br>@두번째유리병</div>
      </q-toolbar>
      <q-tabs
        v-if="notHomePage && $q.platform.is.desktop"
        class="text-dark bg-googleBack lt-md"
        active-color="primary"               
        dense
        align="justify"
      >
        <q-route-tab v-for="link in linksList" 
          :key="link.children[0].meta.title" 
          :to="link.path" class="q-px-xs" 
          :icon="'img:' + link.children[0].meta.icon" 
          :label="link.children[0].meta.shortName" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      @on-layout="handleMenuBtn"
      style="background-color: bisque;"
    >
      <q-list>
        <q-item-label
          header
          class="q-py-sm row justify-between items-center"
          style="background-color: antiquewhite;"
        >
          이런 것도 있어요
          <q-btn icon="home" flat round to="/" dense></q-btn>
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.children[0].meta.title"
          v-bind="link.children[0]"
          style="border-bottom: dotted;"
        />
      </q-list>
    </q-drawer>
    <q-footer bordered class="bg-googleBack">
      <q-tabs    
        v-if="$q.platform.is.mobile && notHomePage"     
        class="text-dark"
        active-color="primary"
        active-bg-color="brown-1"        
        dense
        align="justify"
      >
        <q-route-tab v-for="link in linksList" 
            :key="link.children[0].meta.title" 
            :to="link.path" class="q-px-xs" 
            :icon="'img:' + link.children[0].meta.icon" 
            :label="link.children[0].meta.shortName" />
      </q-tabs>  
      <!-- adsense -->
      <FixedAdsenseComponent v-if="$q.platform.is.desktop" />          
    </q-footer>
    <q-page-container style="min-height: 100vh;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue'
import VersionInfo from '../../package.json'
import routes from 'src/router/routes'
import FixedAdsenseComponent from 'src/components/FixedAdsenseComponent.vue';

defineOptions({
  name: 'MainLayout'
})

const $q = useQuasar()
const route = useRoute()
const myVersion = VersionInfo.version
const linksList = routes.slice(1, routes.length - 1)

const onlySmallWindow = ref(true)
const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
// 모바일이고 홈페이지가 아닐때에만 하단 바 등장
// 데스크탑이고 화면이 좌측 툴바가 닫힐 정도로 작으면 상단 바 등장
const notHomePage = computed(()=>{
    switch(true){      
      case route.path === "/":
        return false
      default:
        return true
    }
  })
// 좌측 메뉴바가 화면에 고정될 정도로 화면이 크면 메뉴 열고 닫는 버튼 삭제
function handleMenuBtn(state){  
  state ? onlySmallWindow.value = false : onlySmallWindow.value = true
}
</script>
