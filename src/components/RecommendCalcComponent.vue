<template>
    <div>
        <q-toolbar class="bg-primary text-white text-center">
            <q-toolbar-title>알차게 준비했습니다</q-toolbar-title>
        </q-toolbar>    
        <q-space />
        <div class="column items-center relative-position"  style="height: 67vh;">                
            <div class="q-mt-md text-h6 text-weight-bolder row justify-center">            
            놀랍도록 강화된 다양한 계산기를 만나보세요
            </div>
            <div>(100% 재밌음)</div>
            <q-img    
            class="absolute-bottom"  
            style="max-height: 60%;"
            fit="scale-down"
            src="images/drPika.png"></q-img>
            <q-btn push class="text-h6 shadow-4 q-mt-md" color="primary" label="시작하기" to="/" @click="triggerEvent('click_recommend')" padding="md lg"></q-btn>
        </div>
    </div>
</template>

<script setup>
import { triggerEvent } from 'src/utils/gtmAddEvent';
</script>