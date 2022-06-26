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

#### 1) Hover 했을 경우   


| <img src="https://user-images.githubusercontent.com/85853145/175816212-9884fa0c-5dd5-4f4b-bc23-5daacd71e16f.png" width="380" height="400"> | <img src="https://user-images.githubusercontent.com/85853145/175816395-3ba42405-4728-40d4-906c-186efd0c550a.png" width="380" height="400"> | <img src="https://user-images.githubusercontent.com/85853145/175816460-5f7aefe1-760e-4c3a-9403-9008855bba5e.png" width="380" height="400"> |
| ------ | ------ | ----- |   

해당 박스가 영화라면 왼쪽처럼 런타임을, TV 시리즈라면 총 시리즈 개수를 나타내고 싶었다.    

가장 오른쪽 사진의 받아오는 데이터 api 의 내용을 살펴보면 모든 미디어 정보에 해당하는 고유 id 는 물론 media_type 도 명시되어 있었다.   

1. 그래서 `framer-motion` 라이브러리의 한 기능인 `onHoverStart()` 를 이용한다.
2. 고유 id 와 media_type 을 넘겨준다.
3. media_type 이 “tv” 일 경우, 고유 id를 이용해 tvDetail 를, “movie” 일 경우, movieDetail 정보를 `useQuery()` 를 이용해 fetch 한다.
4. 해당 정보를 적절히 배치해준다.   

위에서 차례로 설명한 순서를 코드와 함께 보면 다음과 같다. 먼저 세 부분에 `useState()` 를 이용했다.

해당 박스가 movie 인지 tv 시리즈인지 판별해줄 boolean 형과 tvID와 movieID 의 값을 변경해줄 용도!

```tsx
const [isMovie, setIsMovie] = useState(false);
const [movieId, setMovieId] = useState(0);
const [tvId, setTvId] = useState(0);
```

그리고 박스 부분에서는 아래처럼 `onHoverStart()` 를 이용해 id 와 media_type 를 넘겨주면 

```tsx
<BoxThumbnail
    **onHoverStart={() => whenBoxHovered(trend.id!, trend.media_type!)}**  
    onClick={()=> whenBoxClicked(trend.id!, trend.media_type!)}
    bgphoto={makeImage(trend.backdrop_path, "w500")}>
    <BoxTitle variants={boxTitleVars}>{trend.name || trend.title}</BoxTitle>
</BoxThumbnail>
```

mediaType에 따라 구분한 뒤, 위의 `useState()` 를 이용해 영화인지 아닌지를 판별하고 id를 세팅한다.

```tsx
const whenBoxHovered = (Id : number, mediaType : string) => {
    if(mediaType === "movie"){
        setIsMovie(true);
        setMovieId(Id);
    } if(mediaType === "tv") {
        setIsMovie(false);
        setTvId(Id);
    }
}
```

그리고 `useQuery()` 를 이용해 데이터를 fetch 해오는 부분에서 받아 알맞은 데이터를 받아온 뒤

```tsx
const { data:trendingMovieDetail } = useQuery<IMovieDetail>(
    ["trendingMovieDetail", movieId], () => GetMovieDetail(+movieId!)
);

const { data:trendingTvDetail } = useQuery<ITvDetail>(
    ["trendingTvDetail", tvId], () => GetTvDetail(+tvId!)
);
```

영화인지 아닌지를 판별했던 isMovie 에 따라 나타나는 정보가 다르게 나타나도록 세팅하면 끝..!

```tsx
<BoxInfo>
  <LanguageTag>{isMovie ? (`${trendingMovieDetail?.original_language}`) : (`${trendingTvDetail?.original_language}`)}</LanguageTag>
  {isMovie ? (
      <span style={{margin : '0px 8px'}}>
          {Math.floor(+`${trendingMovieDetail?.runtime}` / 60)}h {Math.floor(+`${trendingMovieDetail?.runtime}` % 60)}m
      </span>
  ) : (
      <span style={{margin : '0px 8px', fontSize : '13px'}}>
          {trendingTvDetail?.number_of_seasons} {trendingTvDetail?.number_of_seasons === 1 ? "Season" : "Seasons"}
      </span>
  )}
  <StatusTag>{isMovie ? (`${trendingMovieDetail?.status}`) : (`${trendingTvDetail?.status}`)}</StatusTag>
</BoxInfo>
```

영화 런타임은 `00h 00m` 형태로 나타내기 위해 `Math` 함수를 이용해서 맞췄고, tv 시리즈 개수는 해놓으니 단수, 복수냐가 신경쓰여서 *~~(괜히 언어를 영어로 해선..)~~* 시리즈가 1일 경우는 Season, 아니면 Seasons 로 나타나게 했다.


#### 2) Click 해서 모달 띄우기


| <img src="https://user-images.githubusercontent.com/85853145/175816968-094b3ce7-e10f-47f6-91c3-735be5f01c0c.png" width="650" height="400">| <img src="https://user-images.githubusercontent.com/85853145/175816985-0aa71d08-4825-4b1d-8906-d39cf6f3dbde.png" width="650" height="400"> |
| ------ | ------ |


클릭했을 경우도 `onHoverStart()` 거의 똑같은 원리로 작동한다.   
`onClick={()=> whenBoxClicked(trend.id!, trend.media_type!)}` 으로 id 와 meida_type 을 넘겨주면

```tsx
const whenBoxClicked = (Id : number, mediaType : string) => {
    if(mediaType === "movie"){
        navigate(`/movies/${Id}`);
    } if(mediaType === "tv") {
        navigate(`/tv/${Id}`);
    }
};
```
모달은 `useMatch()` 를 이용해서 해당 id 를 뽑아내고 이를 이용해 필요한 data 를 불러온다.

```tsx
const moviePathMatch = useMatch("/movies/:movieId");
const movieId = moviePathMatch?.params.movieId;

const { data : MovieData } = useQuery<IMovieDetail>(
    ["movieDetail", movieId], () => GetMovieDetail(+movieId!)
);

const { data : MovieCredit } = useQuery<IGetCredits>(
    ["movieCredit", movieId], () => GetMovieCredits(+movieId!)
);

const { data : SimilarMovie } = useQuery<IGetMoviesResult>(
    ["similarMovie", movieId], () => GetSimilarMovies(+movieId!)
);
```

이 데이터를 적재적소에 배치하면 끝! 모달창 구성요소는 tv시리즈가 시즌 정보를 표시한다는 것을 제외하고는 모두 같다.    
시즌 정보는 기본적인 썸네일 이미지와 제목, 방영 날짜, 그리고 대략적인 줄거리를 표시했다.




## Publish / 배포 😌
- 개인적인 API 키가 포함된 부분은 `dotenv`를 이용해서 `gitignore` 로 처리해준 뒤 깃허브페이지에 배포완료.!
