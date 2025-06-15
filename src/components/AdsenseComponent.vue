<template>
  <!-- responsive ads -->
  <div v-if="!$q.platform.is.desktop" class="full-width q-py-sm row justify-center">
    <ins class="adsbygoogle"
      style="display:block; width: 100%; height:250px;"
      data-ad-client="ca-pub-5269959789341273"
      data-ad-slot="4218885917"  
    ></ins>
  </div>
</template>

<script setup>
import { onMounted} from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
// const props = defineProps({
//   platform: { type: String, required: true }
// });

function loadAds() {  
  // 중복 호출 방지
  if(!$q.platform.is.desktop){
    document.querySelectorAll('ins.adsbygoogle').forEach(ins => {
      if (ins.getAttribute('data-adsbygoogle-status') !== 'done') {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      }
    });
  }
}

onMounted(()=>{
  // Load Google AdSense script if not already present
  if (!window.adsbygoogle) {    
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(script);
    script.onload = loadAds;
  } else {
    loadAds();
  }
})

</script>
