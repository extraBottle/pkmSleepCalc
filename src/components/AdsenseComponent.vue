<template>
  <div>  
  <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-5269959789341273"
     :data-ad-slot="props.adSlot"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  </div>
</template>

<script setup>
import { onMounted} from 'vue'
const props = defineProps({
  // 광고 모양 결정
  adSlot: { type: String, required: true }
});

function loadAds() {
  if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
    window.adsbygoogle.push({});
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
