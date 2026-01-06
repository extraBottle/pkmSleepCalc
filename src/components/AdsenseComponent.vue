<template>
    <div>  
    <ins class="adsbygoogle"      
      :style="props.adStyle"
      data-ad-client="ca-pub-5269959789341273"
      :data-ad-slot="props.adSlot"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted} from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const props = defineProps({
  adStyle: { type: String },
  adSlot: { type: String, required: true }
});

function loadAds() {  
  // Only push if the specific 'ins' inside THIS component isn't done
  const ins = adContainer.value.querySelector('ins.adsbygoogle');
  if (ins && ins.getAttribute('data-adsbygoogle-status') !== 'done') {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
}
// function loadAds() {  
//   // 중복 호출 방지
//   document.querySelectorAll('ins.adsbygoogle').forEach(ins => {
//     if (ins.getAttribute('data-adsbygoogle-status') !== 'done') {
//       if (window.adsbygoogle) {
//         window.adsbygoogle.push({});
//       }
//     }
//   });
// }

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
