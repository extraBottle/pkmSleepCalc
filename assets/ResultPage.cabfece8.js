import{u as be,d as Oe,c as Be,Q as Ve,a as Ce,b as Re}from"./inputStore.c4ea7ef7.js";import{r as d,m as U,a as Qe,aP as _e,G as I,T as ce,K as t,I as s,L as i,V as Pe,N as K,al as Te,aB as Fe,J as z,O as j,Q as re,M as Y,R as qe,H as ve,aQ as Ie,S as fe,ag as we,o as Ae,aO as $e,b as Ue,az as je,aA as Ge}from"./index.f2092414.js";import{a as ze,Q as Ke}from"./QPage.ea13a3f3.js";import{d as xe,e as Ee}from"./QItem.d897a790.js";import{a as Ye,u as We,Q as Je,t as Xe,b as Ze}from"./tooltip.894ff50b.js";import{Q as et}from"./QSelect.e733300a.js";import{Q as G,a as V}from"./QCardSection.161192b3.js";import{Q as ne}from"./QSeparator.b49145aa.js";import{u as ye}from"./finalCalcStore.1075178c.js";import"./use-panel.1d357d19.js";import"./touch.3df10340.js";import"./selection.9714b15d.js";import"./QDialog.3735c179.js";const tt={class:"column items-center q-gutter-y-md relative-position"},at={class:"full-width row justify-between"},lt={class:"text-h5 text-center text-weight-bold clean-wrap"},ot=i("span",{class:"text-subtitle2"},"(\uAE30\uB313\uAC12)",-1),st={class:"col"},nt={class:"text-h5 q-py-sm"},ct={key:0,class:"col"},rt={class:"text-h5 q-py-sm"},it={key:1,class:"col"},ut={class:"text-h5 q-py-sm"},mt={key:2,class:"col"},dt={class:"row q-py-sm"},pt={class:"text-h5 no-wrap"},gt=i("div",{class:"text-subtitle1 no-wrap"},"(\uB098\uBA38\uC9C0 \uBAA8\uB4E0 \uC2DD\uC7AC\uB8CC)",-1),kt=Object.assign({name:"IngResult"},{__name:"ResultProdComponent",props:{startLoad:{type:Boolean}},setup(ie){const R=ie,a=Ye(),k=We(),c=be(),w=Oe(),r=Be(),e=ye(),b=d(k.fetchImage("pkm",c.selectedPkmDex)),l=d(c.pkmName),o=c.pkmLevel,n=c.upNature,h=c.downNature,p=a.upMult[n],m=a.downMult[h],W=c.hbCount,J=a.hbMult,v=c.subSkills,u=a.searchPkmData("name",a.convertKorEn(l.value)),X=a.maxHS,P=c.evoCount,N=c.firstIng,C=c.secondIng,f=c.thirdIng,D=c.mainSkillLevel,Q=a.mealRecovery,Z=a.maxE,T=a.totalMainSkill,F=r.mainSkillLevel,q=w.sleepTime,g=r.calcVer,L=r.healSkillCount,ee=a.timeForFull,H=r.upNature,M=r.downNature,Se=r.pkmName,te=r.pkmLevel,O=r.subSkills,x=a.searchPkmData("name",a.convertKorEn(Se)),ae=c.erbCount,le=a.erbMult,E=a.enerPerHour,S=a.speedEnerMultList,A=r.evoCount,ue=["\uD55C\uB07C","1\uC77C"],_=d(ue[0]),me=d(k.fetchIcon("ing",N.replace(/\s/g,"").toLowerCase())),de=d(k.fetchIcon("ing",C.replace(/\s/g,"").toLowerCase())),pe=d(k.fetchIcon("ing",f.replace(/\s/g,"").toLowerCase())),ge=r.secondIng,ke=r.thirdIng,y=d(c.useGoodCamp),oe=U(()=>y.value?"":"invisible"),Ne=U(()=>l.value+"\uC758 "+(_.value==="\uD55C\uB07C"?"\uD55C\uB07C\uB2F9":"\uD558\uB8E8")+" \uC0DD\uC0B0\uB7C9");Qe(()=>{c.hasEssential()&&e.onlyBaseSpeed===0&&(e.calcLoading=!0)}),_e(async()=>{try{if(R.startLoad){let se={},B={},$={},he={};u.skill.name.includes("Metronome")&&(await a.fetchPkmData("LEAFEON"),await a.fetchPkmData("UMBREON"),await a.fetchPkmData("VAPOREON"),await a.fetchPkmData("SYLVEON"),se=a.searchPkmData("name","VAPOREON").skill,B=a.searchPkmData("name","UMBREON").skill,$=a.searchPkmData("name","LEAFEON").skill,he=a.searchPkmData("name","SYLVEON").skill),e.onlyBaseSpeed=e.calcBaseSpeed(o,n,h,p,m,W,J,v,u,X,y.value),e.finalSkillProc=e.calcSkillProc(u,n,h,p,m,v),e.finalIngProc=e.calcIngProc(u,n,h,p,m,v),console.log(u,n,h,p,m,v),g==="proVer"?(e.onlyBaseSpeedH=e.calcBaseSpeed(te,H,M,p,m,W,J,O,x,X,y.value),e.finalSkillProcH=e.calcSkillProc(x,H,M,p,m,O),e.finalIngProcH=e.calcIngProc(x,H,M,p,m,O),e.calcEnergyCurve(he,B,$,T,o,P,v,C,f,D,u,Q,y.value,Z,F,q,g,L,ee,n,h,p,m,ae,le,E,S,x,A,O,te,ge,ke,H,M)):e.calcEnergyCurve(he,B,$,T,o,P,v,C,f,D,u,Q,y.value,Z,F,q,g,L,ee,n,h,p,m,ae,le,E,S,x),e.calcSpeedWithEner(S,g,E),g!=="proVer"&&(u.skill.name.includes("Charge Energy")||u.skill.name.includes("Energizing Cheer")||u.skill.name.includes("Energy For Everyone")||u.skill.name.includes("Metronome"))&&(e.calcEnergyCurve(he,B,$,T,o,P,v,C,f,D,u,Q,y.value,Z,F,q,g,L,ee,n,h,p,m,ae,le,E,S,x,A,O,te,ge,ke,H,M),e.calcSpeedWithEner(S,g,E)),e.calcLeveLIng(g,se,T,!1,u,o,N,C,f,q,E,S,P,v,y.value,D),e.calcLoading=!1}}catch(se){console.log("ing production calc err",se)}});const De=U(()=>_.value==="\uD55C\uB07C"?Math.round(e.totalIngCalc[N]/3):Math.round(e.totalIngCalc[N])),Le=U(()=>_.value==="\uD55C\uB07C"?Math.round(e.totalIngCalc[C]/3):Math.round(e.totalIngCalc[C])),He=U(()=>_.value==="\uD55C\uB07C"?Math.round(e.totalIngCalc[f]/3):Math.round(e.totalIngCalc[f])),Me=U(()=>_.value==="\uD55C\uB07C"?(e.totalIngCalc.all/3).toFixed(2):e.totalIngCalc.all.toFixed(2));return(se,B)=>(I(),ce(Pe,null,[t(xe,{class:"bg-primary text-white text-center"},{default:s(()=>[t(Ee,null,{default:s(()=>[K("\uC0DD\uC0B0\uB7C9 \uBCF4\uACE0\uC11C")]),_:1})]),_:1}),i("div",tt,[t(ze,{alt:"Pokemon image",src:b.value,fit:"scale-down",style:{"max-width":"300px"},"no-spinner":""},null,8,["src"]),t(G,{bordered:"",class:"full-width bg-googleBack"},{default:s(()=>[t(V,null,{default:s(()=>[i("div",at,[t(Te,{class:Fe(oe.value),size:"xl",name:"img:images/goodcampticket.png"},{default:s(()=>[t(Je,{"hide-delay":z(Xe)()},{default:s(()=>[K(" \uC88B\uC740 \uCEA0\uD504 \uC801\uC6A9 \uC911! ")]),_:1},8,["hide-delay"])]),_:1},8,["class"]),t(et,{outlined:"",dense:"",modelValue:_.value,"onUpdate:modelValue":B[0]||(B[0]=$=>_.value=$),options:ue},null,8,["modelValue"])]),i("div",lt,[K(j(Ne.value)+" ",1),ot])]),_:1}),t(ne,{inset:""}),t(V,{class:"column q-gutter-y-md"},{default:s(()=>[i("div",st,[t(G,null,{default:s(()=>[t(V,{class:"row bg-sSkill"},{default:s(()=>[t(re,{class:"shadow-1",color:"ingCircle",icon:me.value},null,8,["icon"]),t(ne,{vertical:"",class:"q-mx-md"}),i("div",nt,j(De.value)+" \uAC1C",1)]),_:1})]),_:1})]),z(e).checkSecondDisplay?(I(),ce("div",ct,[t(G,null,{default:s(()=>[t(V,{class:"row bg-sSkill"},{default:s(()=>[t(re,{class:"shadow-1",color:"ingCircle",icon:de.value},null,8,["icon"]),t(ne,{vertical:"",class:"q-mx-md"}),i("span",rt,j(Le.value)+" \uAC1C",1)]),_:1})]),_:1})])):Y("",!0),z(e).checkThirdDisplay?(I(),ce("div",it,[t(G,null,{default:s(()=>[t(V,{class:"row bg-sSkill"},{default:s(()=>[t(re,{class:"shadow-1",color:"ingCircle",icon:pe.value},null,8,["icon"]),t(ne,{vertical:"",class:"q-mx-md"}),i("span",ut,j(He.value)+" \uAC1C",1)]),_:1})]),_:1})])):Y("",!0),z(e).checkIngSkillDisplay?(I(),ce("div",mt,[t(G,null,{default:s(()=>[t(V,{class:"row bg-sSkill no-wrap"},{default:s(()=>[t(re,{class:"shadow-1",color:"ingCircle",icon:"img:images/ingall.png"}),t(ne,{vertical:"",class:"q-mx-md"}),i("div",dt,[i("div",pt,j(Me.value)+" \uAC1C\xA0",1),gt])]),_:1})]),_:1})])):Y("",!0)]),_:1})]),_:1})])],64))}}),ht={class:"column items-center q-gutter-y-md relative-position"},vt={class:"row"},ft=i("div",{class:"q-mx-sm"},null,-1),St={class:"text-caption q-py-sm"},_t=i("br",null,null,-1),yt=Object.assign({name:"EnerResult"},{__name:"ResultEnergyComponent",props:{startLoad:{type:Boolean}},setup(ie){const R=ie,a=ye(),k=d();function c(){k.value.updateSeries([]),a.calcLoading=!0}_e(async()=>{try{if(R.startLoad){const e=await Ie(()=>import("./tooltip.894ff50b.js").then(function(oe){return oe.p}),["assets/tooltip.894ff50b.js","assets/index.f2092414.js","assets/index.4cd4186e.css","assets/QSelect.e733300a.js","assets/selection.9714b15d.js","assets/QDialog.3735c179.js","assets/QItem.d897a790.js"]),b=await Ie(()=>import("./inputStore.c4ea7ef7.js").then(function(oe){return oe.i}),["assets/inputStore.c4ea7ef7.js","assets/index.f2092414.js","assets/index.4cd4186e.css","assets/use-panel.1d357d19.js","assets/touch.3df10340.js","assets/selection.9714b15d.js"]),l=e.usePkmDBStore(),o=b.useInputStore(),n=b.useHealerInputStore(),h=b.useSleepTimeInputStore(),p=d(o.pkmName),m=o.pkmLevel,W=o.upNature,J=o.downNature,v=l.upMult[W],u=l.downMult[J],X=o.subSkills,P=l.searchPkmData("name",l.convertKorEn(p.value)),N=o.evoCount,C=o.firstIng,f=o.secondIng,D=o.thirdIng,Q=o.mainSkillLevel,Z=l.mealRecovery,T=l.maxE,F=l.totalMainSkill,q=n.mainSkillLevel,g=h.sleepTime,L=n.calcVer,ee=n.healSkillCount,H=l.timeForFull,M=n.upNature,Se=n.downNature,te=n.pkmName,O=n.pkmLevel,x=n.subSkills,ae=l.searchPkmData("name",l.convertKorEn(te)),le=o.erbCount,E=l.erbMult,S=l.enerPerHour,A=l.speedEnerMultList,ue=n.evoCount;let _={},me={},de={},pe={};P.skill.name.includes("Metronome")&&(await l.fetchPkmData("LEAFEON"),await l.fetchPkmData("UMBREON"),await l.fetchPkmData("VAPOREON"),await l.fetchPkmData("SYLVEON"),_=l.searchPkmData("name","VAPOREON").skill,me=l.searchPkmData("name","UMBREON").skill,de=l.searchPkmData("name","LEAFEON").skill,pe=l.searchPkmData("name","SYLVEON").skill);const ge=n.secondIng,ke=n.thirdIng,y=d(o.useGoodCamp);a.calcEnergyCurve(pe,me,de,F,m,N,X,f,D,Q,P,Z,y.value,T,q,g,L,ee,H,W,J,v,u,le,E,S,A,ae,ue,x,O,ge,ke,M,Se),a.calcSpeedWithEner(A,L,S),a.calcLeveLIng(L,_,F,!1,P,m,C,f,D,g,S,A,N,X,y.value,Q),k.value.updateSeries([{name:"\uB0A8\uC740 \uAE30\uB825\uB7C9",data:a.energyAxis}]),a.calcLoading=!1}}catch(e){console.log("energy calc err",e)}});const w={chart:{toolbar:{show:!1}},dataLabels:{enabled:!1},noData:{text:"\uAE30\uB825 \uACC4\uC0B0 \uC911..."},stroke:{curve:"straight"},xaxis:{title:{text:"\uC2DC\uAC04 \uACBD\uACFC (h)"},type:"numeric",labels:{formatter:function(e){return(e/2).toFixed(1)}}},yaxis:{title:{text:"\uB0A8\uC740 \uAE30\uB825\uB7C9 (%)"},labels:{formatter:function(e){return Math.floor(e)}},min:0,max:150},fill:{type:"gradient",gradient:{shade:"dark",gradientToColors:["#FDD835"],opacityFrom:1,opacityTo:.01,stops:[0,100,100,100]}}},r=[{name:"\uB0A8\uC740 \uAE30\uB825\uB7C9",data:a.energyAxis}];return(e,b)=>{const l=qe("apexchart");return I(),ce(Pe,null,[t(xe,{class:"bg-primary text-white text-center"},{default:s(()=>[t(Ee,null,{default:s(()=>[K("\uAE30\uB825 \uBCC0\uD654 \uADF8\uB798\uD504")]),_:1})]),_:1}),i("div",ht,[t(l,{ref_key:"energyChartRef",ref:k,class:"apexchart_width",type:"area",options:w,series:r},null,512),z(a).finalSkillProcH>0?(I(),ve(G,{key:0},{default:s(()=>[t(V,{class:"bg-sSkill"},{default:s(()=>[i("div",vt,[t(re,{size:"md",class:"shadow-1",color:"secondary","text-color":"white",icon:"priority_high"}),ft,i("span",St,[K("\uC704 \uADF8\uB798\uD504\uB294 "+j(z(a).simulationCount)+"\uD68C \uBAA8\uC758\uC2DC\uD589\uC758 \uAE30\uB313\uAC12\uC785\uB2C8\uB2E4.",1),_t,K("\uB9E4 \uC2DC\uD589\uB9C8\uB2E4 \uACB0\uACFC\uAC00 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")])]),t(fe,{class:"full-width",rounded:"",label:"\uAE30\uB825 \uB2E4\uC2DC \uACC4\uC0B0\uD558\uAE30",icon:"restart_alt",color:"positive",onClick:c})]),_:1})]),_:1})):Y("",!0)])],64)}}}),Bt=Object.assign({name:"ResultPage"},{__name:"ResultPage",setup(ie){const R=be(),a=ye(),k=we(),c=Ze(),w=d(!1);Ae(()=>{R.hasEssential()||(we().push("/prodcalc"),$e("\uD3EC\uCF13\uBAAC \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"))}),Ue(()=>{a.clearCalc()}),_e(()=>{if(R.hasEssential())if(a.calcLoading){je("\uACC4\uC0B0 \uC911...");const l=c.platform.is.mobile?100:30;setTimeout(()=>{w.value=!0},l)}else w.value=!1,Ge()});const r=d(1),e=d();function b(){a.clearCalc(),k.push("/prodcalc")}return(l,o)=>(I(),ve(Ke,{class:"row justify-center bg-googleDark relative-position"},{default:s(()=>[t(Re,{modelValue:r.value,"onUpdate:modelValue":o[2]||(o[2]=n=>r.value=n),ref_key:"stepper",ref:e,contracted:"",color:"primary","active-icon":"none",class:"col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack",animated:""},{navigation:s(()=>[t(Ve,{class:"row justify-between"},{default:s(()=>[t(fe,{push:"",icon:"refresh",color:"primary",onClick:b,label:"\uB2E4\uC2DC\uD558\uAE30","text-color":"white"}),i("div",null,[r.value>1?(I(),ve(fe,{key:0,flat:"",color:"primary",onClick:o[0]||(o[0]=n=>e.value.previous()),label:"\uB4A4\uB85C",class:"q-ml-sm"})):Y("",!0),r.value<2?(I(),ve(fe,{key:1,onClick:o[1]||(o[1]=n=>e.value.next()),color:"primary",label:"\uB2E4\uC74C"})):Y("",!0)])]),_:1})]),default:s(()=>[t(Ce,{name:1,title:"\uC0DD\uC0B0\uB7C9 \uBCF4\uACE0\uC11C",icon:"assignment"},{default:s(()=>[t(kt,{"start-load":w.value},null,8,["start-load"])]),_:1}),t(Ce,{name:2,title:"\uAE30\uB825 \uADF8\uB798\uD504",icon:"favorite"},{default:s(()=>[t(yt,{"start-load":w.value},null,8,["start-load"])]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});export{Bt as default};
