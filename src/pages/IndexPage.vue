<template>
  <q-page class="row justify-center bg-googleDark">
    <div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-6 bg-googleBack column" style="max-height: 100vh;">      
      <div class="col-auto q-pt-md full-width">
        <div class="row justify-center">
          <q-btn class="invisible" icon="help" round flat dense />
          <q-chip class="text-subtitle1" color="primary" text-color="white">
            {{ slide.meta.title }}     
          </q-chip>      
          <q-btn color="grey-5" icon="help" round flat dense @click="showHelp = true"></q-btn>  
        </div>
        <div class="relative-position">        
          <Carousel ref="myCarousel" :itemsToShow="1.95" :wrapAround="true" :transition="100" :modelValue="2" @slide-end="updateTitle" :breakpoints="bpCarousel">        
            <Slide v-for="(calc, index) in sliceRoute" :key="calc.path">
              <div class="carousel__item">
                <q-btn flat round @click="clickCalc(index)">
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
              </div>
            </Slide>    
            <template #addons>
              <pagination />
            </template>            
          </Carousel>    
          <q-btn class="absolute-left" icon="arrow_back_ios" @click="myCarousel.prev()" color="primary" size="lg" dense flat/>  
          <q-btn class="absolute-right" icon="arrow_forward_ios" @click="myCarousel.next()" color="primary" size="lg" dense flat/>  
        </div>         
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
                <div class="text-h6 text-bold">{{ slide.meta.title }}</div>   
                <q-img
                  alt="Calc image"
                  :src="slide.meta.icon"
                  fit="scale-down"
                  style="width: 100px;"
                  >
                </q-img>                                        
              </div>
            </q-card-section>   
            <q-separator inset />
            <q-card-section>
              {{ slide.meta.help }}
            </q-card-section>
          </q-card>
        </q-dialog>  
      </div>
      <div class="col"></div>
      <q-img
          class="col-auto"
          style="max-height: 50vh;"
          fit="scale-down"
          :src="doorImage"></q-img> 
    </div>    
    <!-- vertical ad -->    
    <AdsenseComponent v-if="$q.platform.is.desktop" class="gt-sm q-ml-md"   
      style="position: sticky; top: 60px;"   
      ad-style="display:inline-block;width:300px; height:600px; position: sticky; top: 60px;"
      ad-slot="9801335336" 
    />         
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import routes from 'src/router/routes'
import { useQuasar } from 'quasar'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import AdsenseComponent from 'src/components/AdsenseComponent.vue';
import 'src/css/carousel.css'
defineOptions({
  name: 'IndexPage'
});
const $q = useQuasar()
const sliceRoute = routes.slice(1, routes.length - 1)
const router = useRouter()
const myCarousel = ref(null)
// 현재 슬라이드 속 라우터 이름
const slide = ref(sliceRoute[2].children[0])
// 홈화면 이미지
const doorImage = ref('images/doorImage.png')
const showHelp = ref(false)
const bpCarousel = {
  500: {
    itemsToShow: 3.1,
    snapAlign: 'center',
  },
  770: {
    itemsToShow: 3.3,
    snapAlign: 'center',
  },
  860: {
    itemsToShow: 3.9,
    snapAlign: 'center',
  },
  1024: {
    itemsToShow: 2.8,
    snapAlign: 'center',
  },
  1180: {
    itemsToShow: 3.5,
    snapAlign: 'center',
  },
  2000: {
    itemsToShow: 4.5,
    snapAlign: 'center',
  }
}
// 계산기 제목 표시
function updateTitle(data){
  slide.value = sliceRoute[data.currentSlideIndex].children[0]
}
// 계산기 클릭 & 좌우 이동 (화면에 선택지를 최대 5개까지만 출력한다고 가정)
function clickCalc(index){  
  const gap = myCarousel.value.data.currentSlide.value - index
  if(slide.value.name === sliceRoute[index].children[0].name){
    // 가운데 계산기 클릭하면 바로 이동
    router.push({ name: slide.value.name })
  }
  else if(gap > 2 || gap >= -2 && gap < 0){
    // 우측으로 이동    
    myCarousel.value.next()
  }
  else if(gap < -2 || gap > 0 && gap <= 2){
    // 좌측으로 이동
    myCarousel.value.prev()
  }
}

</script>


<style scoped>
.carousel__item {
  min-height: 200px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 5px;
}

.carousel__slide--sliding {
  transition: 0.1s;
}

.carousel__slide {
  opacity: 0.5;
  transform: scale(0.8);
}

.carousel__slide--active ~ .carousel__slide {
  transform: scale(0.8);
}

.carousel__slide--prev {
  opacity: 0.5;
  transform: scale(0.8);
}

.carousel__slide--next {
  opacity: 0.5;
  transform: scale(0.8);
}

.carousel__slide--active {
  opacity: 1;
  transform: scale(1.0);
}
</style>