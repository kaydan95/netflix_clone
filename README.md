# :popcorn: Netflix_Clone [![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

<img src="https://user-images.githubusercontent.com/85853145/163539465-146fd13e-bfa9-4e7c-bbcb-763c952a49cf.png" width="1000" height="500">

## Summary / 요약

- **목적** : NomadCoders React강의 일부 및 다양한 라이브러리 연습
- **라이브러리 종류** : react-query / styled-components / framer-motion / react-router
- **메인 개발 환경** : React / Typescript / JavaScript
- **Data Api** : [The Movie Database Api](https://developers.themoviedb.org/3/getting-started/introduction)
- **Publish** : [넷플릭스_클론](https://kaydan95.github.io/netflix_clone/)
- **프로젝트 정리노트** : [넷플릭스_클론 프로젝트 정리노트](https://www.notion.so/Netflix_clone-d45cb519d6384de3b7accb2295ab33eb)


## For Start / 시작하기 전에
    npm install
<!--     npm install react-router-dom@6
    npm install --save styled-components
    npm i -D @types/styled-components
    npm install react-query
    npm install react-helmet
    npm install recoil
    npm install framer_motion
    npm install react-player
    npm install react-responsive -->

## Features / 최대한 똑같이 만들어보기위한 몸부림..!
### 1. Banner 
#### 1. 들어가자마자 Banner 에는 영상이 재생
- react-player라는 신세계를 만난 시점. 여러 함수가 내장되어있어서 컨트롤 하기도 편했다. 다만 플레이어 크기가 유튜브 영상크기 기준으로 되어있어서 해당 영상 부분의 scale을 1.3 정도로 높여 실제 넷플릭스의 배너처럼 꽉 차보이게 만들었다.
- 따로 `util.ts` 파일을 만들어 안에 clip을 만들 함수를 정의했다. 이 과정에서 CORS 정책때문에 오류가 떠서 clip 만드는 부분에 임시 방편으로 우회 url 을 덧붙여 해결.

```typescript
export function makeClip(key:string){
    return `https://www.cors-anywhere.herokuapp.com/https://www.youtube.com/watch?v=${key}`;
}
```


#### 2. 음소거 및 음소거 해제 버튼
- 사이트마다 영상 정책이 다른 관계로 가장 기본적으로 무조건 음소거가 default 값으로 설정된다. 따라서 실제 넷플릭스에서처럼 볼륨 버튼을 만들어 클릭을 하면 음소거를 설정 혹은 해제 할 수 있도록 만들었다. 

```typescript
const [mute, setMute] = useState(true);
const clickVolume = () => setMute((prev) => !prev);
```

- `useState()` 를 이용한 실제 react-player 에서의 볼륨 버튼 제어 부분dms -> `muted={mute? true : false}` 형태로 처리


#### 3. 스크롤을 내리면 음소거 되게끔하기
- `useViewportScroll()` 를 이용해 `scrollY` 의 움직임을 측정하도록 하고 일정 부분 이상 넘어가면 `setMute(true)` 으로 설정. 이는 `useEffect()` 함수 내에 정의했다.

```typescript
scrollY.onChange(() => {
    if(scrollY.get() > 350){
        setMute(true);
    }
});
```

#### 4. 영화제목과 줄거리 애니메이션 주기 + 영상 끝나면 poster 보여주기
-  기본적으로 animation 은 `useAnimation()`을 이용해서 구현하고 `useState()` 를 이용해서 타이밍을 설정할 수 있게 했다.
-  제일 처음 랜더링 될 때 나타났던 타이틀과 줄거리는 10초 뒤에 사라지고 영상이 끝나면 포스터 이미지로 바뀌면서 다시 나타나야하는 형식이다.
-  사라질때의 애니메이션과 다시 나타날때의 애니메이션를 두가지 state 상태로 정의해준 뒤 `useEffect()` 와 react-player 의 속성 `onEnded={afterEnded}`를 이용해 구현!

```typescript
// 줄거리 애니메이션
const [hideOverview, setHideOverview] = useState(false);
const [showOverview, setShowOverview] = useState(false);
const overviewAni = useAnimation();
const titleAni = useAnimation();

// 영상 끝나면 poster 보여주기
const [endPlaying, setEndPlaying] = useState(false);
const afterEnded = () => {
    setShowOverview(true);
    setEndPlaying(true);
};

useEffect(() => {
    setClipData();
    if(!hideOverview) {
        overviewAni.start('animate');
        titleAni.start('animate');
        setTimeout(() => {
            setHideOverview(true)
        }, 10000);
    }
    if(hideOverview){
        overviewAni.start('exit');
        titleAni.start('exit');
    }
    if(showOverview){
        overviewAni.start('animate');
        titleAni.start('reAnimate');
    }
    scrollY.onChange(() => {
        if(scrollY.get() > 350){
            setMute(true);
        }
    });

}, [hideOverview, showOverview, setClipData]);

// ReactPlayer 부분
<ReactPlayer
    className="react-player" 
    url={makeClip(clipValue?.results[1].key || "")}
    width={'100%'}
    height={'100%'}
    playing={true}
    muted={mute? true : false}
    controls={false}
    loop={false}
    config={{youtube : {
        playerVars : {
            disablekb : 1,
            rel : 0,
            end : 100,
        }
    }}}
    onEnded={afterEnded}
>
</ReactPlayer>

```

### 2. Detail Modal
- 해당 프로젝트에서 구현된 페이지는 애초에 TV 시리즈와 영화의 구분이 없이 한꺼번에 모든 정보를 볼 수 있도록 되어있는 곳이기 때문에 해당 박스에 hover 했을때, 그리고 눌러서 디테일 정보를 볼 수있는 모달창을 띄울 때 알맞은 정보가 띄워져야했다. __즉, hover 또는 클릭을 했을 때 해당 콘텐츠가 TV 시리즈인지 Movie 시리즈인지 구분하여 알맞은 Query 문을 찾아가야한다는 것.__   

1) Hover 했을 경우
2) Click 해서 모달 띄우기

## Publish / 배포 😌
- 개인적인 API 키가 포함된 부분은 `dotenv`를 이용해서 `gitignore` 로 처리해준 뒤 깃허브페이지에 배포완료.!
