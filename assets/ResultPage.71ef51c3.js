import{d as hl,e as yl,f as fl,k as kl,n as Sl,i as Qe,j as He,g as _l,Q as Cl,l as xl,s as bl,o as wl,p as ul,q as Ml}from"./loading.1d51659e.js";import{c as Pl,k as se,h as Bl,g as Nl,aH as Hl,r as _,a as Il,F as ge,R as je,J as o,H as y,K as E,T as ml,M as Ie,ai as Tl,am as ql,N as Re,Q as Ee,I as Xe,L as Ve,O as $l,G as Je,aL as Ql,ac as vl,o as Rl,b as Vl,aM as Al,P as ol}from"./index.dfc23bc4.js";import{a as Fl,Q as zl}from"./QPage.42a2c8c4.js";import{a as Ol,c as jl,j as dl,k as pl}from"./QItem.94a5a640.js";import"./use-timeout.3f889e19.js";const El={true:"inset",item:"item-inset","item-thumbnail":"item-thumbnail-inset"},nl={xs:2,sm:4,md:8,lg:16,xl:24};var Oe=Pl({name:"QSeparator",props:{...Ol,spaced:[Boolean,String],inset:[Boolean,String],vertical:Boolean,color:String,size:String},setup(m){const N=Nl(),e=jl(m,N.proxy.$q),g=se(()=>m.vertical===!0?"vertical":"horizontal"),u=se(()=>` q-separator--${g.value}`),X=se(()=>m.inset!==!1?`${u.value}-${El[m.inset]}`:""),x=se(()=>`q-separator${u.value}${X.value}`+(m.color!==void 0?` bg-${m.color}`:"")+(e.value===!0?" q-separator--dark":"")),a=se(()=>{const T={};if(m.size!==void 0&&(T[m.vertical===!0?"width":"height"]=m.size),m.spaced!==!1){const A=m.spaced===!0?`${nl.md}px`:m.spaced in nl?`${nl[m.spaced]}px`:m.spaced,oe=m.vertical===!0?["Left","Right"]:["Top","Bottom"];T[`margin${oe[0]}`]=T[`margin${oe[1]}`]=A}return T});return()=>Bl("hr",{class:x.value,style:a.value,"aria-orientation":g.value})}});const sl=Hl("production-calc",()=>{const m=_(0),N=_(0),e=_([]),g=_(0),u=_(0),X=_(0),x=_(0),a=_(0),T=_(!1),A=_(!1),oe=_(!1),c=_({}),F=_({}),Y=_(!0),s=2,Z=1/30,Ae=1/(60*30),ue=1e4;function he(k={},I,v,d,n,t=[]){const r=k.ingredientPercentage;let l=1;I==="\uC2DD\uC7AC\uB8CC \uB3C4\uC6B0\uBBF8 \uD655\uB960 \u25B2\u25B2"?l=d:v==="\uC2DD\uC7AC\uB8CC \uB3C4\uC6B0\uBBF8 \uD655\uB960 \u25BD\u25BD"&&(l=n);let i=1;for(let f=0;f<t.length;f++)(t[f].label==="\uC2DD\uC7AC\uB8CC \uD655\uB960 \uC5C5 M"||t[f].label==="\uC2DD\uC7AC\uB8CC \uD655\uB960 \uC5C5 s")&&(i+=t[f].mult);return console.log("calcIngProc",r,l,i),r*l*i/100}function Ke(k={},I,v,d,n,t=[]){const r=k.skillPercentage,l=I==="\uBA54\uC778 \uC2A4\uD0AC \uBC1C\uB3D9\uB960 \u25B2\u25B2"?d:v==="\uBA54\uC778 \uC2A4\uD0AC \uBC1C\uB3D9\uB960 \u25BD\u25BD"?n:1;let i=1;for(let f=0;f<t.length;f++)(t[f].label==="\uC2A4\uD0AC \uD655\uB960 \uC5C5 M"||t[f].label==="\uC2A4\uD0AC \uD655\uB960 \uC5C5 s")&&(i+=t[f].mult);return console.log("calcsKillProc",r,l,i),r*l*i/100}function Fe(k,I,v,d,n,t,r,l=[],i={},f,b){const q=I==="\uB3C4\uC6B0\uBBF8 \uC2A4\uD53C\uB4DC \u25B2\u25B2"?d:v==="\uB3C4\uC6B0\uBBF8 \uC2A4\uD53C\uB4DC \u25BD\u25BD"?n:1,w=t*r;let $=0;for(let C=0;C<l.length;C++)(l[C].label==="\uB3C4\uC6B0\uBBF8 \uC2A4\uD53C\uB4DC M"||l[C].label==="\uB3C4\uC6B0\uBBF8 \uC2A4\uD53C\uB4DC s")&&($+=l[C].mult);$=$+w>=f?f:$+w;const z=(501-k)/500*q*(1-$);console.log("calcBaseSpeed");const S=b?.8:1;return i.frequency*z*Ae*S}function Te(k,I,v,d,n,t,r,l,i,f,b,q,w="",$,z,S,C,K,M,H,ne,ee,Q,D,ve,G=0,be=[],ce=0,fe="",_e="",U="",we=""){let L=ve.skill.amount[q-1],p=l.skill.amount[r-1],W=w.split(":");const re=parseInt(W[0],10),me=parseInt(W[1],10),Me=24*s-re*s-me*Z,De=Me-1,Ge=De-Math.floor((Me-7*s)/2),Ye=Ge-6*s;function Ze(J){for(const te of i)if(J>=te.e)return te.m}let el=1;C==="\uAE30\uB825 \uD68C\uBCF5\uB7C9 \u25B2\u25B2"?(el=M,L=Math.floor(L*M),p=Math.floor(p*M)):K==="\uAE30\uB825 \uD68C\uBCF5\uB7C9 \u25BD\u25BD"&&(el=H,L=Math.floor(L*H),p=Math.floor(p*H));const cl=ne*ee+1;let le=100/(S/s)*(re*s+me*Z)*el*cl;le=le>100?100:Math.floor(le);let Pe=!1,qe=1;l.skill.name.includes("Charge Energy")?(Pe=!0,qe=1):l.skill.name.includes("Energizing Cheer")?(Pe=!0,qe=5):l.skill.name.includes("Metronome")&&(Pe=!0,qe=(k-1)/(6/5));function Ce(J){return J>b?b:J}if($!=="proVer"){let h=function(P,ae=1,ie=L){let B=0;switch($!=="lightVer"&&(ie=0),P===0?B=le+ie:e.value[e.value.length-1].y<=0?B=ie*ae:B=e.value[e.value.length-1].y+ie*ae-Math.floor(Q/s),B){case B>b:return b;case B<0:return 0;default:return B}};e.value.push({x:0,y:le});const J=Math.floor(Me/z);let te=1;Pe&&(te=Math.round(z*(l.skillPercentage/ve.skillPercentage)*(ve.frequency/l.frequency)/qe)),console.log("\uC790\uD790 \uD69F\uC218",te);const xe=Math.floor(Me/te);let $e=z;for(let P=0;P<Me+1;P++){let ae=h(P,0);if(e.value.push({x:P,y:ae}),P===0&&($e-=1),console.log("\uBC25\uC2DC\uAC04",Ye,Ge,De),(P===Ye||P===Ge||P===De)&&(e.value.push({x:P,y:Ce(ae+Ze(ae))}),console.log("\uBC25\uBA39\uC790")),$==="lightVer"&&P>0){if(Pe&&P%xe===0&&te>0){let ie=h(P,1,p);e.value.push({x:P,y:Ce(ie)}),te-=1}if(P%J===0&&$e>0){let ie=h(P);e.value.push({x:P,y:Ce(ie)}),$e-=1}}}}else if($==="proVer"){let ae=function(B,R,de){let V=de>b?b:de;B>0?e.value[R].y=(e.value[R].y*B+V)/(B+1):e.value.push({x:R,y:V})},ie=function(B){let R=0;return h>0&&(h=h-1*(Q/s),h>b&&(h=b)),h<=0&&(h=0),e.value[B-1].y>0&&(R=e.value[B-1].y-1*(Q/s),R>b&&(R=b)),R<0?0:(console.log("\uACC4\uC0B0 \uACB0\uACFC \uAE30\uB825=",R),R)};e.value=[];let J=ve.skill.amount[q-1],te=1;U==="\uAE30\uB825 \uD68C\uBCF5\uB7C9 \u25B2\u25B2"?(te=M,J=Math.floor(J*M)):we==="\uAE30\uB825 \uD68C\uBCF5\uB7C9 \u25BD\u25BD"&&(te=H,J=Math.floor(J*H));let xe=100/(S/s)*(re*s+me*Z)*te*cl;xe=xe>100?100:xe;let h=xe,$e=.8,P=.4;for(let B=0;B<ue;B++){Math.random()<$e?(h+=J,Math.random()<P?ae(B,0,Ce(le+p+L)):ae(B,0,Ce(le+L))):Math.random()<P?ae(B,0,Ce(le+p)):ae(B,0,Ce(le));let R=N.value,de=m.value;for(let V=1;V<Me+1;V++){let Ue=function(O){for(let j=0;j<D.length;j++)if(O>D[j].e)return ll=D[j].e,D[j].m;return D[D.length-1].m},il=function(O,j,Ne){return(j-Ne)/(Q/s)+O};const rl=h;let pe=ie(V),ll=0;const tl=Ue(h),Be=Ue(rl);let ze=0;if(tl!==Be){let O=il(V-1,rl,ll)-(V-1);R=R-(O/Be+(1-O)/tl)%N.value,ze=Math.floor((O/Be+(1-O)/tl)/N.value)}else R=R-1/Be%N.value,ze=Math.floor(1/Be/N.value);if(R<=0&&(ze+=1,R+=N.value),Pe){let O=0;const j=Ue(pe),Ne=Ue(e.value[V-1].y);if(j!==Ne){let We=il(V-1,e.value[V-1].y,ll)-(V-1);de=de-(We/Ne+(1-We)/j)%m.value,O=Math.floor((We/Ne+(1-We)/j)/m.value)}else de=de-1/Be%N.value,O=Math.floor(1/Be/N.value);de<=0&&(O+=1,de+=m.value);const al=1-Math.pow(1-X.value/qe,O);O>0&&Math.random()<al&&(pe+=p)}const gl=1-Math.pow(1-x.value,ze);if((V===Ye||V===Ge||V===De)&&(pe+=Ze(pe),h+=Ze(h)),ze>0&&Math.random()<gl&&(pe+=L,h+=J),ae(B,V,Ce(pe)),V===Me){let O=h,j=0;if(pe-Math.ceil(Q/s*(re*s+me*Z))<0?j=0:j=pe-Math.ceil(Q/s*(re*s+me*Z)),h-Math.ceil(Q/s*(re*s+me*Z))<0?h=0:h=h-Math.ceil(Q/s*(re*s+me*Z)),le=j+le>100?100:j+le,h=h+xe>100?100:h+xe,Pe){const al=Se(w,pe,D,l,v,d,I,n,t,Q,f);P=1-Math.pow(1-X.value/qe,al)}const Ne=Se(w,O,D,ve,G,be,ce,fe,_e,Q,"healer",f);$e=1-Math.pow(1-x.value,Ne)}}}}console.log("calcEnergyCurve")}function ye(k=[],I="target",v){F.value={},k.forEach(l=>{F.value[l.m]=0});let d=0;function n(l){for(let i=0;i<k.length;i++)if(l>k[i].e)return d=k[i].e,k[i].m;return d=k[k.length-1].e,k[k.length-1].m}function t(l,i,f){return(f-e.value[l].y)/((e.value[l].y-e.value[i].y)/(e.value[l].x-e.value[i].x))+e.value[l].x}for(let l=0;l<e.value.length-1;l++)if(e.value[l].x!==e.value[l+1].x){let i=n(e.value[l+1].y),f=e.value[l].x,b=!0,q=e.value[l+1].x;I==="proVer"&&e.value[l].y<=e.value[l+1].y&&(i=n(e.value[l].y-v/s*(e.value[l+1].x-e.value[l].x)));let w=n(e.value[l].y);for(;b;)w===i?(F.value[w]+=e.value[l+1].x-f,b=!1):(q=t(l,l+1,d),F.value[w]+=q-f,w=n(d),f=q)}let r=0;for(let l in F.value)r+=F.value[l]/parseFloat(l);a.value=Math.floor(r/m.value),Y.value=!1,console.log("calcSpeedWithEner"),console.log("\uBA38\uBB34\uB974\uB294 \uC2DC\uAC04",F.value)}function ke(k,I=!1,v={},d,n,t,r,l,i,f,b,q,w,$){const z=Se(l,e.value[e.value.length-1].y,f,v,b,q,d,t,r,i,w);console.log("count",z),console.log("\uCD1D \uB3C4\uC6B0\uBBF8 \uD68C\u3153\u3145\u3145",a.value);function S(C,K){let M=0;return K<30?M=v[`ingredient${K}`].amount:M=v[`ingredient${K}`].find(H=>H.ingredient.longName===C).amount,console.log("levamount",M,g.value),console.log("\uC2DD\uC7AC \uAC1C\uC218 \uACC4\uC0B0",(a.value+z)*g.value*M),I?z*g.value*M:(a.value+z)*g.value*M}c.value[n]=S(n,0),d>=30&&(t===n?(c.value[n]=(c.value[n]+S(t,30))/2,T.value=!1):(c.value[n]=c.value[n]/2,c.value[t]=S(t,30)/2,T.value=!0),d>=60&&(c.value[n]=c.value[n]*2/3,n===t?r!==t?(c.value[r]=S(r,60)/3,A.value=!0):(c.value[n]=c.value[n]+S(r,60)/3,A.value=!1):(c.value[t]=c.value[t]*2/3,r===n?(c.value[n]=c.value[n]+S(r,60)/3,A.value=!1):r===t?(c.value[t]=c.value[t]+S(r,60)/3,A.value=!1):(c.value[r]=S(r,60)/3,A.value=!0)))),(v.skill.unit==="ingredients"||v.skill.name==="Metronome")&&(async()=>{try{const K=await(await fetch("https://api.sleepapi.net/api/ingredient")).json(),M=v.skill.name==="Metronome"?k-1:1,H=Math.ceil(v.skill.amount[$-1]/3),ne=1-(1-1/K.length)*(1-1/(K.length-1))*(1-1/(K.length-2)),ee=(a.value+z)*X.value*H*ne/M;oe.value=!0,c.value[n]+=ee,c.value.hasOwnProperty(t)&&(c.value[t]+=ee),c.value.hasOwnProperty(r)&&(c.value[r]+=ee),c.value.all=ee}catch(C){console.log("ing Fetch problem: "+C.message)}})(),console.log("calcLevelIng")}function Se(k,I,v,d,n,t,r,l,i,f,b="target",q){let w=k.split(":");const $=parseInt(w[0],10),z=parseInt(w[1],10);let S={};v.forEach(p=>{S[p.m]=0});let C=0;function K(p){for(let W=0;W<v.length;W++)if(p>v[W].e)return C=v[W].e,v[W].m;return C=0,v[v.length-1].m}let M=K(I),H=0,ne=(I-C)/(f/s);for(;M!==v[v.length-1].m;)S[M]+=ne-H,M=K(C),H=ne,ne=(I-C)/(f/s);ne=$*s+z*Z,S[M]+=ne-H;let ee=0;for(let p in S)ee+=S[p]/parseFloat(p);let Q=0;b==="target"?Q=Math.floor(ee/m.value):Q=Math.floor(ee/N.value);let D=!1;const ve=q?1.2:1;let G=(d.carrySize+n*5)*ve;for(let p=0;p<t.length;p++)t[p].label==="\uCD5C\uB300 \uC18C\uC9C0 \uC218 \uC5C5 L"||t[p].label==="\uCD5C\uB300 \uC18C\uC9C0 \uC218 \uC5C5 M"||t[p].label==="\uCD5C\uB300 \uC18C\uC9C0 \uC218 \uC5C5 s"?G+=t[p].mult:t[p].label==="\uB098\uBB34\uC5F4\uB9E4 \uC218 s"&&(D=!0);function be(p,W){return d[`ingredient${W}`].find(me=>me.ingredient.longName===p).amount}let ce=0,fe=0,_e=0,U=1;switch(!0){case r>=60:U=3,ce=d.ingredient0.amount*g.value/U,fe=be(l,30)*g.value/U,_e=be(i,60)*g.value/U;break;case r>=30:U=2,ce=d.ingredient0.amount*g.value/U,fe=be(l,30)*g.value/U;break;default:U=1,ce=d.ingredient0.amount*g.value/U}let we=1;d.specialty==="berry"&&(we+=1),D&&(we+=1);const L=we*(1-g.value);return Math.ceil(G/(L+ce+fe+_e))>Q?Q:(console.log("nan???",G,typeof L,typeof ce,typeof fe,typeof _e),Math.ceil(G/(L+ce+fe+_e)))}function Le(){m.value=0,N.value=0,e.value=[],a.value=0,g.value=0,u.value=0,X.value=0,x.value=0,T.value=!1,A.value=!1,oe.value=!1,Y.value=!0,c.value={},F.value={}}return{onlyBaseSpeed:m,onlyBaseSpeedH:N,energyAxis:e,finalSpeedCount:a,finalIngProc:g,finalIngProcH:u,finalSkillProc:X,finalSkillProcH:x,checkSecondDisplay:T,checkThirdDisplay:A,checkIngSkillDisplay:oe,totalIngCalc:c,timeStaying:F,calcLoading:Y,convertH:s,convertM:Z,convertS:Ae,simulationCount:ue,calcIngProc:he,calcBaseSpeed:Fe,calcEnergyCurve:Te,calcSpeedWithEner:ye,clearCalc:Le,calcSleepSpeedCount:Se,calcLeveLIng:ke,calcSkillProc:Ke}}),Xl={class:"column items-center q-gutter-y-md relative-position"},Kl={class:"full-width row justify-between"},Ll={class:"text-h5 text-center text-weight-bold clean-wrap"},Dl=E("span",{class:"text-subtitle2"},"(\uAE30\uB313\uAC12)",-1),Gl={class:"col"},Ul={class:"text-h5 q-py-sm"},Wl={key:0,class:"col"},Jl={class:"text-h5 q-py-sm"},Yl={key:1,class:"col"},Zl={class:"text-h5 q-py-sm"},et={key:2,class:"col"},lt={class:"text-h5 q-py-sm"},tt=E("span",{class:"text-subtitle1"}," (\uB098\uBA38\uC9C0 \uBAA8\uB4E0 \uC2DD\uC7AC\uB8CC)",-1),at=Object.assign({name:"IngResult"},{__name:"ResultProdComponent",props:{isLoading:{type:Boolean}},setup(m,{expose:N}){const e=hl(),g=yl(),u=fl(),X=kl(),x=Sl(),a=sl(),T=_(g.fetchImage("pkm",u.selectedPkmDex)),A=_(u.pkmName),oe=u.pkmLevel,c=u.upNature,F=u.downNature,Y=e.upMult[c],s=e.downMult[F],Z=u.hbCount,Ae=e.hbMult,ue=u.subSkills,he=e.searchPkmData("name",e.convertKorEn(A.value)),Ke=e.maxHS,Fe=u.evoCount,Te=u.firstIng,ye=u.secondIng,ke=u.thirdIng,Se=u.mainSkillLevel,Le=e.mealRecovery,k=e.maxE,I=e.totalMainSkill,v=x.mainSkillLevel,d=X.sleepTime,n=x.calcVer,t=x.healSkillCount,r=e.timeForFull,l=x.upNature,i=x.downNature,f=x.pkmName,b=x.pkmLevel,q=x.subSkills,w=e.searchPkmData("name",e.convertKorEn(f)),$=u.erbCount,z=e.erbMult,S=e.enerPerHour,C=e.speedEnerMultList,K=x.evoCount,M=["\uD55C\uB07C","1\uC77C"],H=_(M[0]),ne=_(g.fetchIcon("ing",Te.replace(/\s/g,"").toLowerCase())),ee=_(g.fetchIcon("ing",ye.replace(/\s/g,"").toLowerCase())),Q=_(g.fetchIcon("ing",ke.replace(/\s/g,"").toLowerCase())),D=x.secondIng,ve=x.thirdIng,G=_(u.useGoodCamp),be=se(()=>G.value?"":"invisible"),ce=_(!0),fe=se(()=>A.value+"\uC758 "+(H.value==="\uD55C\uB07C"?"\uD55C\uB07C\uB2F9":"\uD558\uB8E8")+" \uC0DD\uC0B0\uB7C9");Il(()=>{u.hasEssential()&&a.onlyBaseSpeed===0&&setTimeout(function(){a.onlyBaseSpeed=a.calcBaseSpeed(oe,c,F,Y,s,Z,Ae,ue,he,Ke,G.value),a.finalSkillProc=a.calcSkillProc(he,c,F,Y,s,ue),n==="proVer"?(a.onlyBaseSpeedH=a.calcBaseSpeed(b,l,i,Y,s,Z,Ae,q,w,Ke,G.value),a.finalSkillProcH=a.calcSkillProc(w,l,i,Y,s,q),a.calcEnergyCurve(I,oe,Fe,ue,ye,ke,Se,he,Le,G.value,k,v,d,n,t,r,c,F,Y,s,$,z,S,C,w,K,q,b,D,ve,l,i),a.finalIngProcH=a.calcIngProc(w,l,i,Y,s,q)):a.calcEnergyCurve(I,oe,Fe,ue,ye,ke,Se,he,Le,G.value,k,v,d,n,t,r,c,F,Y,s,$,z,S,C,w),a.calcSpeedWithEner(C,n,S),a.finalIngProc=a.calcIngProc(he,c,F,Y,s,ue),a.calcLeveLIng(I,!1,he,oe,Te,ye,ke,d,S,C,Fe,ue,G.value,Se)},30)});const _e=se(()=>H.value==="\uD55C\uB07C"?Math.round(a.totalIngCalc[Te]/3):Math.round(a.totalIngCalc[Te])),U=se(()=>H.value==="\uD55C\uB07C"?Math.round(a.totalIngCalc[ye]/3):Math.round(a.totalIngCalc[ye])),we=se(()=>H.value==="\uD55C\uB07C"?Math.round(a.totalIngCalc[ke]/3):Math.round(a.totalIngCalc[ke])),L=se(()=>H.value==="\uD55C\uB07C"?(a.totalIngCalc.all/3).toFixed(2):a.totalIngCalc.all.toFixed(2));return N({calcLoading:ce}),(p,W)=>(ge(),je(ml,null,[o(dl,{class:"bg-primary text-white text-center"},{default:y(()=>[o(pl,null,{default:y(()=>[Ie("\uC0DD\uC0B0\uB7C9 \uBCF4\uACE0\uC11C")]),_:1})]),_:1}),E("div",Xl,[o(Fl,{alt:"Pokemon image",src:T.value,fit:"scale-down",style:{"max-width":"300px"},"no-spinner":""},null,8,["src"]),o(Qe,{bordered:"",class:"full-width bg-googleBack"},{default:y(()=>[o(He,null,{default:y(()=>[E("div",Kl,[o(Tl,{class:ql(be.value),size:"xl",name:"img:images/goodcampticket.png"},{default:y(()=>[o(_l,null,{default:y(()=>[Ie(" \uC88B\uC740 \uCEA0\uD504 \uC801\uC6A9 \uC911! ")]),_:1})]),_:1},8,["class"]),o(Cl,{outlined:"",dense:"",modelValue:H.value,"onUpdate:modelValue":W[0]||(W[0]=re=>H.value=re),options:M},null,8,["modelValue"])]),E("div",Ll,[Ie(Re(fe.value)+" ",1),Dl])]),_:1}),o(Oe,{inset:""}),o(He,{class:"column q-gutter-y-md"},{default:y(()=>[E("div",Gl,[o(Qe,null,{default:y(()=>[o(He,{class:"row bg-sSkill"},{default:y(()=>[o(Ee,{class:"shadow-1",color:"ingCircle",icon:ne.value},null,8,["icon"]),o(Oe,{vertical:"",class:"q-mx-md"}),E("div",Ul,Re(_e.value)+" \uAC1C",1)]),_:1})]),_:1})]),Xe(a).checkSecondDisplay?(ge(),je("div",Wl,[o(Qe,null,{default:y(()=>[o(He,{class:"row bg-sSkill"},{default:y(()=>[o(Ee,{class:"shadow-1",color:"ingCircle",icon:ee.value},null,8,["icon"]),o(Oe,{vertical:"",class:"q-mx-md"}),E("span",Jl,Re(U.value)+" \uAC1C",1)]),_:1})]),_:1})])):Ve("",!0),Xe(a).checkThirdDisplay?(ge(),je("div",Yl,[o(Qe,null,{default:y(()=>[o(He,{class:"row bg-sSkill"},{default:y(()=>[o(Ee,{class:"shadow-1",color:"ingCircle",icon:Q.value},null,8,["icon"]),o(Oe,{vertical:"",class:"q-mx-md"}),E("span",Zl,Re(we.value)+" \uAC1C",1)]),_:1})]),_:1})])):Ve("",!0),Xe(a).checkIngSkillDisplay?(ge(),je("div",et,[o(Qe,null,{default:y(()=>[o(He,{class:"row bg-sSkill"},{default:y(()=>[o(Ee,{class:"shadow-1",color:"ingCircle",icon:"img:images/ingall.png"}),o(Oe,{vertical:"",class:"q-mx-md"}),E("span",lt,[Ie(Re(L.value)+" \uAC1C",1),tt])]),_:1})]),_:1})])):Ve("",!0)]),_:1})]),_:1})])],64))}}),ot={class:"column items-center q-gutter-y-md relative-position"},nt=E("div",{class:"q-mx-sm"},null,-1),st={class:"text-caption q-py-sm"},ct=E("br",null,null,-1),rt=Object.assign({name:"EnerResult"},{__name:"ResultEnergyComponent",setup(m){const N=sl(),e={chart:{toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"straight"},xaxis:{title:{text:"\uC2DC\uAC04 \uACBD\uACFC (h)"},type:"numeric",labels:{formatter:function(u){return(u/2).toFixed(1)}}},yaxis:{title:{text:"\uB0A8\uC740 \uAE30\uB825\uB7C9 (%)"},labels:{formatter:function(u){return Math.floor(u)}},min:0,max:150},fill:{type:"gradient",gradient:{shade:"dark",gradientToColors:["#FDD835"],opacityFrom:1,opacityTo:.01,stops:[0,100,100,100]}}},g=[{name:"\uB0A8\uC740 \uAE30\uB825\uB7C9",data:N.energyAxis}];return(u,X)=>{const x=$l("apexchart");return ge(),je(ml,null,[o(dl,{class:"bg-primary text-white text-center"},{default:y(()=>[o(pl,null,{default:y(()=>[Ie("\uAE30\uB825 \uBCC0\uD654 \uADF8\uB798\uD504")]),_:1})]),_:1}),E("div",ot,[o(x,{style:{width:"80%"},type:"area",options:e,series:g}),Xe(N).finalSkillProcH>0?(ge(),Je(Qe,{key:0},{default:y(()=>[o(He,{class:"row bg-sSkill"},{default:y(()=>[o(Ee,{size:"md",class:"shadow-1",color:"secondary","text-color":"white",icon:"priority_high"}),nt,E("span",st,[Ie("\uC704 \uADF8\uB798\uD504\uB294 "+Re(Xe(N).simulationCount)+"\uD68C \uBAA8\uC758\uC2DC\uD589\uC758 \uAE30\uB313\uAC12\uC785\uB2C8\uB2E4.",1),ct,Ie("\uB9E4 \uC2DC\uD589\uB9C8\uB2E4 \uACB0\uACFC\uAC00 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")])]),_:1})]),_:1})):Ve("",!0)])],64)}}});function it(m){Ql.create({color:"red-4",textColor:"white",icon:"block",message:m})}const pt=Object.assign({name:"ResultPage"},{__name:"ResultPage",setup(m){const N=fl(),e=sl(),g=vl();Rl(()=>{N.hasEssential()?xl("\uACC4\uC0B0 \uC911..."):(vl().push("/prodcalc"),it("\uD3EC\uCF13\uBAAC \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"))}),Vl(()=>{e.clearCalc()}),Al(()=>{e.calcLoading||bl()});const u=_(1),X=_();function x(){g.push("/prodcalc"),e.clearCalc()}return(a,T)=>(ge(),Je(zl,{class:"row justify-center bg-googleDark relative-position"},{default:y(()=>[o(Ml,{modelValue:u.value,"onUpdate:modelValue":T[2]||(T[2]=A=>u.value=A),ref_key:"stepper",ref:X,contracted:"",color:"primary","active-icon":"none",class:"col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 bg-googleBack",animated:""},{navigation:y(()=>[o(wl,{class:"row justify-between"},{default:y(()=>[o(ol,{push:"",icon:"refresh",color:"primary",onClick:x,label:"\uB2E4\uC2DC\uD558\uAE30","text-color":"white"}),E("div",null,[u.value>1?(ge(),Je(ol,{key:0,flat:"",color:"primary",onClick:T[0]||(T[0]=A=>X.value.previous()),label:"\uB4A4\uB85C",class:"q-ml-sm"})):Ve("",!0),u.value<2?(ge(),Je(ol,{key:1,onClick:T[1]||(T[1]=A=>X.value.next()),color:"primary",label:"\uB2E4\uC74C"})):Ve("",!0)])]),_:1})]),default:y(()=>[o(ul,{name:1,title:"\uC0DD\uC0B0\uB7C9 \uBCF4\uACE0\uC11C",icon:"assignment"},{default:y(()=>[o(at)]),_:1}),o(ul,{name:2,title:"\uAE30\uB825 \uADF8\uB798\uD504",icon:"favorite"},{default:y(()=>[o(rt)]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});export{pt as default};
