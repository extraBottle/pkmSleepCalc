<template>
  <!-- horizontal ads (for desktop) -->
  <div v-if="$q.platform.is.desktop && props.platform === 'desktop'" class="row justify-center">  
    <ins class="adsbygoogle"
      style="display:inline-block;width:728px;height:90px;"
      data-ad-client="ca-pub-5269959789341273"
      data-ad-slot="8898165826"
    ></ins>
  </div>
  <!-- responsive ads -->
  <div v-else-if="!$q.platform.is.desktop && props.platform !== 'desktop'">
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-5269959789341273"
      data-ad-slot="4218885917"
      data-ad-format="auto"
      data-full-width-responsive="true"     
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
  document.querySelectorAll('ins.adsbygoogle').forEach(ins => {
    if (ins.getAttribute('data-adsbygoogle-status') !== 'done') {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    }
  });
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
