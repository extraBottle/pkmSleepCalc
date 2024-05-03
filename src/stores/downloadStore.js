import { defineStore } from 'pinia';

// 외부 사이트에서 포켓몬 데이터 불러오기
export const useDownloadStore = defineStore('download-src', ()=> {

    // img 태그가 불러올수 있는 url을 반환
    function fetchImage(target, inputData){
        let firstSrc = "";
        switch(target){
            // 포켓몬 이미지
            case "pkm":
                if(Math.random() < 0.005){
                    // 0.5% 확률로 색이 다른 포켓몬을 로딩
                    firstSrc = "https://www.serebii.net/pokemonsleep/pokemon/shiny/";    
                }
                else{
                    firstSrc = "https://www.serebii.net/pokemonsleep/pokemon/";
                }                
                break;
            // 포켓몬 자는 이미지
            case "sleep":
                firstSrc = "https://www.serebii.net/pokemonsleep/pokemon/sleep/";
                break;
            // 식재료 이미지
            case "ing":
                firstSrc = "https://www.serebii.net/pokemonsleep/ingredients/";
                break;
            // 나무열매 이미지
            case "berry":
                firstSrc = "https://www.serebii.net/pokemonsleep/berries/"
                inputData = inputData.toLowerCase() + "berry"
                break;
            default:
                return 0
        }
        return firstSrc + inputData + ".png"
    }
    // 위 링크를 아이콘에 넣을 수 있게 변환
    function fetchIcon(t, i){
        return "img:" + fetchImage(t, i)
    }

    return {
        fetchImage,
        fetchIcon
    }
})
