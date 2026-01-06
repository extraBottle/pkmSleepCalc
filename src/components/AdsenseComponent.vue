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

const props = defineProps({
  adStyle: { type: String },
  adSlot: { type: String, required: true },
  delay: { type: Number, default: 0 }
});

function loadAds() {  
  try {
    // 중복 호출 방지 & 화면 구성이 끝나야 출력
    const ads = document.querySelectorAll('ins.adsbygoogle');
    ads.forEach(ins => {
      if (ins.getAttribute('data-adsbygoogle-status') !== 'done' && ins.offsetWidth > 100) {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      }
    });
  } catch (e) {
    console.warn("AdSense push failed, ignoring to prevent layout freeze:", e);
  }
}

onMounted(()=>{
  // 화면 전환 끝난 이후에 애드센스 출력
  setTimeout(() => {
    // 애드센스 실행
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
  }, props.delay);
})

</script>
