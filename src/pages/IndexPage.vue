<template>
  <q-page class="row justify-center bg-googleDark">
    <div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack relative-position">
      <q-img
      class="absolute-bottom"
      style="max-height: 60%;"
      fit="scale-down"
      :src="randImage"></q-img>
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        padding
        arrows
        infinite
        navigation
        navigation-position="top"
        class="rounded-borders transparent"
      >
        <q-carousel-slide v-for="calc in sliceRoute" :name="calc.children[0].name" v-bind:key="calc.path" class="row justify-center items-start relative">           
          <div class="relative-position">
            <q-chip class="text-subtitle1 q-mb-md shadow-4" color="primary" text-color="white">
              {{ calc.children[0].meta.title }}            
            </q-chip>
            <q-btn style="position: absolute; right: -30px;" color="grey-5" icon="help" round flat dense @click="showHelp = true"></q-btn>
          </div>        
          <q-btn class="absolute-center" flat round @click="clickCalc">
            <q-card v-if="calc.children[0].meta.title.includes('이브이')" class="bg-sSkill shadow-8 flex flex-center" style="width: 150px; height: 150px;">
              <q-badge color="secondary" label="Click" rounded floating />
              <q-img src="images/eeveeLink.png" height="130px" width="130px">
              </q-img>
            </q-card>
            <q-card v-else class="bg-sSkill shadow-8">
              <q-badge color="secondary" label="Click" rounded floating />
              <q-img :src="calc.children[0].meta.icon" height="150px" width="150px">
              </q-img>
            </q-card>
          </q-btn>
          <!-- 도움말 팝업창 -->
          <q-dialog v-model="showHelp">
            <q-card style="width: 280px;">
              <q-bar>          
                <div>도움말</div>
                <q-space />          
                <q-btn dense flat icon="close" v-close-popup />                 
              </q-bar>
              <q-card-section>
                <div class="full-width column flex-center">
                  <div class="text-h6 text-bold">{{ calc.children[0].meta.title }}</div>   
                  <q-img
                    alt="Calc image"
                    :src="calc.children[0].meta.icon"
                    fit="scale-down"
                    style="width: 100px;"
                    >
                  </q-img>       
                </div>
              </q-card-section>   
              <q-separator inset />
              <q-card-section>
                {{ calc.children[0].meta.help }}
              </q-card-section>
            </q-card>
          </q-dialog>          
        </q-carousel-slide>
      </q-carousel>
      <q-btn push class="absolute-bottom-right text-h6" color="primary" label="시작하기" @click="clickCalc" padding="md lg"></q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { triggerEvent } from 'src/utils/gtmAddEvent';
import routes from 'src/router/routes'
defineOptions({
  name: 'IndexPage'
});
const sliceRoute = routes.slice(1, routes.length - 1)
const router = useRouter()
const slide = ref(routes[4].children[0].name)
// 랜덤 대문 이미지
const imgList = ["doorImage", "drPika", "dbPika"]
function randPick(){
  const rr = Math.random() * 100
  switch(true){
    case rr > 99:
      return 2
    case rr > 98:
      return 1
    default:
      return 0
  }
}
const randImage = ref(`images/${imgList[randPick()]}.png`)
const showHelp = ref(false)

function clickCalc(){
  triggerEvent('enter_calc_from_home')
  router.push({ name: slide.value })
}

</script>

<style lang="scss">
q-card {
  border-color: $primary;
}
</style>
