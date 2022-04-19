import { motion, AnimatePresence, useAnimation, useViewportScroll } from 'framer-motion';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { IGetTrendingResult, GetTrending, GetMovieClips, IGetClipsResult, GetTvClips, IClip} from '../api';
import { makeClip, makeImage } from '../util';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark, faPlay, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router';


const BannerWrapper = styled.div<{play:boolean}>`
    height : 100vh;
    width : 100%;
    position: relative;
    background-size: cover;
    justify-content: center;
    display : flex;
    flex-direction: column;
    padding : 60px;
    .react-player{
        position : absolute;
        top : 0;
        left: 0;
        z-index : 0;
        width  :100%;
        height : 100%;
        transform: ${props => props.play ? 'scale(1, 1)' : 'scale(1.3, 1.35)'};
    }
`

const Cover = styled.div<{bgPhoto:string, play:boolean}>`
    height : 100vh;
    width : 100%;
    position: absolute;
    top : 0;
    left : 0;
    transform: ${props => props.play ? 'scale(1, 1)' : 'scale(1.3, 1.35)'};
    background-image: ${props => props.play ? `linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24)), url('${props.bgPhoto}')` 
        : 'linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24))' };
    background-size : cover;
`

const BannerInfoWrapper = styled.div`
    display : flex;
    flex-direction: column;
    z-index : 1;
`

const Title = styled(motion.h1)`
    font-size : 3.5rem;
    margin-bottom : 10px;
    transform-origin : left bottom;
    font-family: 'Vidaloka', serif;
    font-weight: bold;
`

const Overview = styled(motion.p)`
    font-size : 1.6em;
    width : 55%;
    height : 150px;
    opacity : 0.8;
    transform-origin : left bottom;
`

export const VolumeBtn = styled.button<{play:boolean}>`
    opacity : ${props => props.play ? 0 : 1};
    width : 40px;
    height : 40px;
    border-radius: 50px;
    font-size : 1.2em;
    background-color: transparent;
    border : 1px solid white;
    display : flex;
    align-items: center;
    justify-content: center;
    color : white;
    margin-left: 10px;
    &:hover{
        cursor: pointer;
        background-color: rgba(218, 218, 218, 0.3);
    }
`

const ViewDetailBtn = styled.button`
    width : 13%;
    height : 50px;
    background-color: rgba(158, 158, 158, 0.4);
    border-radius: 10px;
    color : white;
    font-weight : bold;
    font-size: 1.3em;
    margin-left : 10px;
    border : none;
    &:hover {
        cursor: pointer;
        background-color: rgba(218, 218, 218, 0.3);
    }
`

export const PlayBtn = styled.button`
    width : 10%;
    height : 50px;
    background-color: rgb(255, 255, 255, 0.9);
    border-radius: 5px;
    color : ${props => props.theme.black.lighter};
    font-weight : bold;
    font-size: 1.3em;
    border : none;
    &:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.8);
    }
`

const TitleVars = {
    start : {
        scale : 0.8
    },
    animate : {
        scale : 1,
        transition : {
            duration : 1
        }
    },
    exit : {
        y : 150,
        scale : 1.2,
        transition : {
            bottom : 0,
            duration : 1.5
        }
    },
    reAnimate : {
        y : 0,
        scale : 1,
        transition : {
            bottom : 0,
            duration : 1
        }
    }
}

const OverviewVars = {
    start : {
        scale : 0.8
    },
    animate : {
        scale : 1,
        transition : {
            duration : 1
        }
    },
    exit : {
        scale : 0,
        transition : {
            duration : 1
        }
    }
}

function Banner() {

    const { data, isLoading } = useQuery<IGetTrendingResult>(
        ["trends", "Trending"], GetTrending
    );

    const id = data?.results[1].id;

    const { data:MovieClip } = useQuery<IGetClipsResult>(["movieClips", id], () => GetMovieClips(id!));
    const { data:TvClip } = useQuery<IGetClipsResult>(["tvClips", id], () => GetTvClips(id!));

    // movie 인지 tv 확인하고 해당 data로 세팅
    const [clipValue, setClipValue] = useState(MovieClip);
    const setClipData = () => {
        if(data?.results[1].media_type === "movie") {
            setClipValue(MovieClip!);
        }
        if(data?.results[1].media_type === "tv"){
            setClipValue(TvClip!);
        }
    }

    //  음소거 버튼
    const [mute, setMute] = useState(true);
    const clickVolume = () => setMute((prev) => !prev);

    // 줄거리 애니메이션
    const [hideOverview, setHideOverview] = useState(false);
    const [showOverview, setShowOverview] = useState(false);
    const overviewAni = useAnimation();
    const titleAni = useAnimation();

    // 스크롤내리면 영상음소거
    const { scrollY } = useViewportScroll();

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

    const navigate = useNavigate();

    const whenBoxClicked = (Id : number, mediaType : string) => {
        if(mediaType === "movie"){
            navigate(`/movies/${Id}`);
        } if(mediaType === "tv") {
            navigate(`/tv/${Id}`);
        }
    }

    return (
        <BannerWrapper play={endPlaying}>
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
            <Cover bgPhoto={makeImage(data?.results[1].backdrop_path || "")} play={endPlaying}/>
            <BannerInfoWrapper>
                <AnimatePresence>
                    <div style={{display : 'flex', flexDirection : 'column', position : 'relative'}}>
                        <Title 
                            variants={TitleVars}
                            initial='start'
                            animate={titleAni}
                        >
                            {data?.results[1].title || data?.results[1].name}
                        </Title>
                        <Overview
                            variants={OverviewVars}
                            initial='start'
                            animate={overviewAni}
                        >
                            {data?.results[1].overview}
                        </Overview>
                    </div>
                </AnimatePresence>
                <div style={{display:'inline-flex', alignItems:'center', margin:'20px 0px'}}>
                    <PlayBtn><FontAwesomeIcon icon={faPlay}/> Play</PlayBtn>
                    <ViewDetailBtn onClick={()=> whenBoxClicked(data?.results[1].id!, data?.results[1].media_type!)}>
                        <FontAwesomeIcon icon={faCircleInfo}/> View Detail
                    </ViewDetailBtn>
                    <VolumeBtn onClick={clickVolume} play={endPlaying}>
                        {mute ? (<FontAwesomeIcon icon={faVolumeXmark} />) : (<FontAwesomeIcon icon={faVolumeHigh} />)}
                    </VolumeBtn>
                </div>
            </BannerInfoWrapper>
        </BannerWrapper>
    )
}

export default Banner