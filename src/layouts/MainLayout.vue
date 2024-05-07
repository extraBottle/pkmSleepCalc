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
          {{ route.name }}
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
        <q-item
          clickable          
          tag="a"
          href="https://toss.me/extrabottl"
          target="_blank"
          style="background-color: antiquewhite;"
        >
          <q-item-section avatar>
            <q-avatar>
              <img src="images/dreamclusterl.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">후원하기</q-item-label>            
          </q-item-section>
          <q-item-section side>
            <q-icon color="grey-5" size="xs" name="open_in_new"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue'
import VersionInfo from '../../package.json'
import routes from 'src/router/routes'

defineOptions({
  name: 'MainLayout'
})

const route = useRoute()
const myVersion = VersionInfo.version
const linksList = routes.slice(1, routes.length - 1)

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
