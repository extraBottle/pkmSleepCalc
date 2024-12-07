# 포슬립 계산기

포슬립 식재료 생산량 계산기...에서 시작해서 지금은 포슬립 통합 계산기

**v0.0.1**
- github action test

**v1.0.0**
- 식재료 생산량 계산 기능 추가
- 목표 포켓몬 스펙 입력 기능 추가
- 좋은 캠프 티켓 사용 여부 선택 기능 추가
- 힐러 포켓몬 설정 (라이트/프로) 기능 추가
- 수면 시간 선택 기능 추가
- google analytics 연결
- 사이드바로 다른 웹페이지 연결 기능 추가
- 결과를 하루, 끼니당으로 분류하기 기능 추가
- 계산 결과 기력 그래프 출력 기능 추가

**v1.0.1**
- meta tag OG 추가

**v1.0.2**
- q-select dialog UI 개선
- 처음 로딩시 불러오는 이미지를 public에서 불러오게 수정
- quasar loading plugin으로 전부 변경
- 손가락 흔들기 스킬 계산에 반영
- 모바일에서 툴팁 클릭시 1초동안 사라지지 않게 수정
- 식재 스킬 발동으로 모은 식재량 text display 개선

**v1.0.3**
- 프로 버전에서 현재 설정 그대로 다시 계산하기 버튼 추가
- 계산 로딩 2분 timeout
- 계산 중 때때로 로딩 화면 안뜨는 오류 수정

**v1.0.4**
- 다시하기 누르면 포켓몬 목록 중첩되는 오류 수정

**v1.0.5**
- 계산 timeout 삭제
- 서브스킬 최대 5개까지 선택 제한
- 손가락흔들기에서 나오는 스킬 랜덤 확률 계산

**v1.0.6**
- analytics boot file execute now depends on cordova

**v1.1.0**
- 선택한 레벨에 맞춰 최대 선택 가능 서브 스킬 수 제한
- 포켓몬 개체값 측정기 추가
- 메인 화면에서 계산기를 선택할 수 있도록 변경
- aws lambda 연결
- 이브이 진화 추천 페이지 이전
- 이브이 진화 추천 알고리즘에서 레벨에 따른 서브 가감점 삭제
- 경험치 계산기 페이지 이전
- google tag manager 연결 및 vue-gtm 적용
- 서브 선택 개수를 선택한 레벨에 맞게 자동으로 설정
- cordova 관련 analytics 삭제
- 메인 화면에서 각 계산기에 대한 안내하는 카드 생성
- 포켓몬 비밀 도감 추가

**v1.1.1**
- exp 계산기 포켓몬 종에 따른 남은 경험치량 계산 오류 수정

**v1.1.2**
- 도우미 보너스 순서에 따라 적용 안되는 오류 수정

**v1.1.3**
- 성격 선택안해도 그냥 넘어가는 오류 수정
- action -> sleep pokemon name list update
- 고정 식재료 정의 오류 수정
- add google adsense tag
- 한국어 태그 설정

**v1.1.4**
- exp 계산기 -> 남은 경험치 적용 안되는 오류 수정

**v1.1.5**
- 비스킬몬 + 자힐몬은 스킬 레벨업 서브가 유효한 서브로 계산
- 최대 스킬렙이 다른 포켓몬으로 교체했을때 최대 레벨을 넘어서는 오류 수정
- 스킬 레벨업 서브가 사용자 입력 메인 스킬 레벨보다 작을 경우 자동으로 서브 적용
- 팀 보너스 백분위 계산 오류 수정
- 식재료 생산량 계산기에 수면시간도 반영했다는 문구 추가

**v1.1.6**
- exp 계산기 포켓몬 종족에 따른 경험치 배율 내림->반올림으로 수정
- 웹페이지 언어가 영어로 인식되는 오류 수정
- add dynamic meta tag for SEO
- 토스 연결 후원하기 기능 추가

**v1.2.0**
- 후원 기능 제거
- 스킬형 포켓몬의 최대 누적 스킬 2회로 상향
- 굿나잇리본 추가

**v1.2.1**
- 레벨 60 적용
- 힐러 평균 스킬 발동 횟수 3 -> 4
- 굿나잇리본 invisible -> hidden

**v1.2.2**
- 선호하는 이브이 진화체 기본 없음으로 설정

**v1.2.3**
- 식재몬 개체값 평가 기준에서 식재료 비중 소폭 증가

**v1.2.4**
- 홈화면 시작하기 버튼 삭제
- 홈화면 좌우 스와이프 버튼 크기 증가
- 모바일에서 하단바, 작은 pc에서 상단바 추가
- 상단 고정바에서 음영효과 제거
- 스킬몬 개체값 평가 기준에서 스킬 비중 극소폭 증가

**v1.2.5**
- 개체값 평가시 추천 설정값 표시
- 홈화면에 다른 계산기 접근성 향상을 위한 ui 수정
- 1920 이상에서 화면 비율 수정
- 좌측 메뉴바가 자동으로 열리는 화면 크기에서는 메뉴바를 닫을 수 없게 수정
- 홈화면 이미지 랜덤 삭제
- 서브스킬 선택 오류시 몇개만 선택해야 하는지 메시지 출력

**v1.2.6**
- 스킬몬 개체값 평가 기준에서 스킬 비중 소폭 증가

**v1.2.7**
- 개체값 계산기에서 추가 힐러의 스펙 상향 4회 -> 5회