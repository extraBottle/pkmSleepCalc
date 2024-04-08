<template>
  <q-page class="row justify-center bg-googleDark">
    <div class="col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack relative-position">
      <q-img
        class="floating1 absolute"
        src="images/fancyapple.png"
        fit="scale-down"
        style="max-height: 300px;"></q-img>
        <q-img
        class="floating2 absolute"
        src="images/warmingginger.png"
        fit="scale-down"
        position="left center"
        style="max-height: 370px;"></q-img>
        <q-img
        class="floating2 absolute"
        src="images/fancyegg.png"
        fit="scale-down"
        position="right center"
        style="max-height: 370px;"></q-img>
      <q-img
      class="absolute-bottom"
      src="images/doorimage.png"></q-img>
      <q-btn push class="absolute-bottom-right text-h6" color="primary" label="시작하기" @click="startProdCalc" padding="md lg"></q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'IndexPage'
});
const router = useRouter()
function startProdCalc(){
  router.push('/prodcalc')
}

</script>

<style>
.floating1 {  
    animation-name: floating;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    
}
 
@keyframes floating {
    0% { transform: translate(0,  0px); }
    50%  { transform: translate(0, 15px); }
    100%   { transform: translate(0, -0px); }    
}
.floating2 {  
    animation-name: floating2;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    
}
 
@keyframes floating2 {
    0% { transform: translate(0,  15px); }
    50%  { transform: translate(0, 0px); }
    100%   { transform: translate(0, 15px); }    
}
</style>
