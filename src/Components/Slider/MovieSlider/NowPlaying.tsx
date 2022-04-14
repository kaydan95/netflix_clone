import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { IMovieDetail, GetMovieDetail, getNowPlayingMovies, IGetMoviesResult } from '../../../api';
import { makeImage } from '../../../util';
import { useMediaQuery } from "react-responsive"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus, faAngleDown, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';



// styled-components

export const SliderWrapper = styled.div`
    position: relative;
    display : flex;
    flex-direction: column;
    margin-bottom: 200px;
    height : fit-content;
`

export const SliderHeader = styled(motion.div)`
    display : inline-flex;
    justify-content: space-between;
    width : 100%;
    padding : 10px 60px;
    margin-bottom: 15px;
`

export const SliderTitle = styled.div`
    font-size : 1.7rem;
    font-weight : bold;
    color : white;
`

export const SliderIndicatorWrapper = styled(motion.div)`
    display : inline-flex;
    align-items: flex-end;
`

export const SliderIndicator = styled(motion.div)`
    width : 15px;
    height : 4px;
    margin : 0px 3px;
    background-color : rgb(75, 75, 75);
`

export const Slider = styled.div`
    position: relative;
`

export const Btn = styled(motion.div)`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width : 80px;
    height : 150px;
    /* bottom : 0; */
    opacity: 1;
    background-color: rgba(0,0,0,0.6);
    span {
        font-size : 2rem;
        font-weight : bold;
        &:hover {
            cursor: pointer;
            font-size: 2.3;
        }
    }
`

export const SliderBtnPrev = styled(Btn)`
    left : 0;
`

export const SliderBtnNext = styled(Btn)`
    right : 0;
`

export const Row = styled(motion.div)`
    display : grid;
    gap : 8px;
    grid-template-columns : repeat(6, 1fr);
    position: absolute;
    bottom : 10;
    width : 100%;

    @media only screen and (min-width:992px) and (max-width:1199px) {
        grid-template-columns : repeat(5, 1fr);
    }
    @media only screen and (min-width:768px) and (max-width:991px) {
        grid-template-columns : repeat(4, 1fr);
    }
    @media only screen and (min-width:600px) and (max-width:767px) {
        grid-template-columns : repeat(3, 1fr);
    }
    @media only screen and (max-width : 599px) {
        grid-template-columns : repeat(2, 1fr);
    }

`

export const Box = styled(motion.div)`
    height : fit-content;
    background-color: transparent;
    display : flex;
    flex-direction : column;
    justify-content: center;
    overflow: hidden;
    border-radius: 10px;
    &:first-child {
        transform-origin : center left;
        margin-left : 10px;
    }
    &:last-child {
        transform-origin : center right;
        margin-right : 10px;
    }
`

export const BoxThumbnail = styled(motion.div)<{bgphoto : string}>`
    background-image : linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24)), url(${props => props.bgphoto});
    background-size : cover;
    background-position: center;
    width : 100%;
    height : 150px;
    display : flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding : 0px 0px 20px 10px;
    &:hover {
        cursor: pointer;
    }
`

export const BoxTitle = styled(motion.h2)`
    font-size : 1.6rem;
    color : ${props => props.theme.white.darker};
    opacity : 0.8;
    font-family: 'Federo', sans-serif;
    font-weight: bold;
`

export const BoxInfoWrapper = styled(motion.div)`
    width : 100%;
    opacity : 0;
    height : 0;
    display : flex;
    flex-direction : column;
    background-color: ${props => props.theme.black.darker};
    transform-origin : center top;
    padding : 15px;
    box-shadow: 1px 5px 3px #292929;
`

export const BoxIconContainer = styled.div`
    width : 100%;
    display : inline-flex;
    justify-content: space-between;
    align-items: center;
`

export const BoxIconWrapper = styled.div`
    display : inline-flex;
    width : 100%;
`

export const IconBtn = styled.button`
    width : 35px;
    height : 35px;
    border-radius: 50px;
    background-color : rgba(92, 92, 92, 0.2);
    border: 2px solid rgb(70, 70, 70);
    color : ${props => props.theme.white.lighter};
    margin-right : 5px;
    display : flex;
    font-size : 1em;
    align-items: center;
    justify-content: center;
    &:hover {
        cursor: pointer;
        border-color: ${props => props.theme.white.darker};
    }
`

export const PlayIconBtn = styled(IconBtn)`
    color : ${props => props.theme.black.darker};
    background-color: ${props => props.theme.white.lighter};
    border : none;
    &:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.85);
    }
`

export const BoxInfo = styled.div`
    width : 100%;
    padding-top: 15px;
    height : fit-content;
    display : flex;
    align-items: center;
`

export const LanguageTag = styled.button`
    width : fit-content;
    font-weight : bold;
    font-size : 1.2em;
    display : flex;
    border : none;
    align-items: center;
    text-transform : uppercase;
    background-color: #001797;
    color : ${props => props.theme.white.lighter};
    padding : 3px 2px;
    border-radius : 5px;
`

export const StatusTag = styled.span`
    border : 0.5px solid white;
    width : fit-content;
    padding : 3px;
    font-size : 0.5em;
    color : ${props => props.theme.white.lighter};
    border-radius : 3px;
`

export const BoxKeyWordsContainer = styled.div`
    width : 100%;
    display : inline-flex;
    padding-top : 10px;
    pre {
        display : inline-flex;
        align-items: center;
        button {
            display : inline-flex;
            align-items: center;
            color : rgb(132, 132, 132);
            background-color: transparent;
            width : fit-content;
            height : fit-content;
            border : none;
            padding : 0;
            font-size : 0.3em;
            margin : 0px 5px;
        }
        &:last-child {
            button {
                opacity : 0;
            }
        }
    }
`

// variants

export const rowVars = {
    invisible : (isBack : boolean) => {
        return {
            x : isBack ? -window.outerWidth - 10 : window.outerWidth + 10,
        }

    },
    visible : {
        x: 0
    },  
    exit : (isBack : boolean) => {
        return {
            x : isBack ? window.outerWidth + 10 : -window.outerWidth - 10
        }

    }
}

export const boxVars = {
    normal : {
        scale : 1,
    },
    hover : {
        scale : 1.3,
        y : -40,
        zIndex : 10000,
        backgroundColor : "#2F2F2F",
        transition : {
            delay : 0.2,
            duration : 0.2,
            type : "tween",
        }
    }
}

export const boxTitleVars = {
    hover : {
        opacity : 1,
    }
}

export const boxInfoVars = {
    hover : {
        opacity : 1,
        height : 150,
    }
}

export const btnVars = {
    normal : {
        opacity : 0,
    },
    hover : {
        opacity : 1,
        transition : {
            delay : 0.2,
            duration : 0.2,
            type : "tween",
        }
    }
}


function NowPlaying() {

    const isLargePC = useMediaQuery({
        query : "(min-width:1200px)" //6
    });

    const isPC = useMediaQuery({
        query : "(min-width:992px) and (max-width:1199px)" //5
    });

    const isTablet = useMediaQuery({
        query : "(min-width:768px) and (max-width:991px)" //4
    });

    const isLargeMobile = useMediaQuery({
        query : "(min-width:600px) and (max-width:767px)" //3
    });

    const isMobile = useMediaQuery({ //2
        query : "(max-width:599px)"
    });

    const [offset, setOffset] = useState(6);

    useEffect(() => {
        if(isLargePC) {
            return setOffset(6);
        }
        if(isPC) {
            return setOffset(5);
        }
        if(isTablet) {
            return setOffset(4);
        }
        if(isLargeMobile) {
            return setOffset(3);
        }
        if(isMobile) {
            return setOffset(2);
        }
    });

    const { data:nowPlaying } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], getNowPlayingMovies
    );

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const navigate = useNavigate();
    const [back, setBack] = useState(false);

    const toggleLeaving = () => setLeaving(prev => !prev);

    const showNext = () => {
        if (nowPlaying){
            if(leaving) return;
            toggleLeaving();
            setBack(false);
            const totalMovies = nowPlaying.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };

    const showPrev = () => {
        if (nowPlaying){
            if(leaving) return;
            toggleLeaving();
            setBack(true);
            const totalMovies = nowPlaying.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === 0 ? maxIndex : prev - 1);
        }
    };

    const [movieId, setMovieId] = useState(0);

    const whenBoxHovered = (movieId : number) => {
        setMovieId(movieId);
    }

    const { data:nowPlayingMovieDetail } = useQuery<IMovieDetail>(
        ["nowPlayingMovieDetail", movieId], () => GetMovieDetail(+movieId!)
    );

    const genresList = nowPlayingMovieDetail?.genres?.slice(0,3).filter((genre) => {
        return genre.name.length < 10;
    });


    const whenBoxClicked = (movieId : number) => {
        navigate(`/movies/${movieId}`);
    }

    return (
        <SliderWrapper>
            <SliderHeader>
                <SliderTitle>NowPlaying</SliderTitle>
                <AnimatePresence>
                    <SliderIndicatorWrapper>
                        <SliderIndicator />
                        <SliderIndicator />
                        <SliderIndicator />
                    </SliderIndicatorWrapper>
                </AnimatePresence>
            </SliderHeader>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={back}>
                    <Row 
                        variants={rowVars}
                        custom={back}
                        initial="invisible"
                        animate="visible"
                        exit="exit"
                        transition={{type:"tween", duration:1}}
                        key={index}
                    >
                        {nowPlaying?.results
                            .slice(offset*index, offset*index+offset)
                            .map((movie) => (
                                <Box key={movie.id}
                                variants={boxVars} 
                                whileHover="hover"
                                initial="normal"
                                transition={{type:"tween"}}
                                // layoutId={movie.id + ""}
                                >
                                    <BoxThumbnail 
                                        onHoverStart={() => whenBoxHovered(movie.id)}
                                        onClick={()=> whenBoxClicked(movie.id)}
                                        bgphoto={makeImage(movie.backdrop_path, "w500")}>
                                        <BoxTitle variants={boxTitleVars}>{movie.title}</BoxTitle>
                                    </BoxThumbnail>
                                    <BoxInfoWrapper variants={boxInfoVars}>
                                        <BoxIconContainer>
                                            <BoxIconWrapper>
                                                <PlayIconBtn><FontAwesomeIcon icon={faPlay} /></PlayIconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faPlus} /></IconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faThumbsUp} /></IconBtn>
                                            </BoxIconWrapper>
                                            <IconBtn onClick={()=> whenBoxClicked(movie.id)}><FontAwesomeIcon icon={faAngleDown} /></IconBtn>
                                        </BoxIconContainer>
                                        <BoxInfo>
                                            <LanguageTag>{nowPlayingMovieDetail?.original_language}</LanguageTag>
                                            <span style={{margin : '0px 8px'}}>
                                                {Math.floor(+`${nowPlayingMovieDetail?.runtime}` / 60)}h {Math.floor(+`${nowPlayingMovieDetail?.runtime}` % 60)}m
                                            </span>
                                            <StatusTag>{nowPlayingMovieDetail?.status}</StatusTag>
                                        </BoxInfo>
                                        <BoxKeyWordsContainer>
                                            {genresList?.map((gen) => (
                                                <pre>
                                                    {gen.name}
                                                    <button><FontAwesomeIcon icon={faCircle} /></button>
                                                </pre>
                                            ))}
                                        </BoxKeyWordsContainer>
                                    </BoxInfoWrapper>
                                </Box>
                            )
                        )}
                    </Row>
                </AnimatePresence>
                <AnimatePresence>
                    <SliderBtnPrev 
                        variants={btnVars}
                        initial='normal'
                        whileHover='hover'
                        onClick={showPrev}
                    >
                        <span> 〈 </span>
                    </SliderBtnPrev>
                    <SliderBtnNext 
                        variants={btnVars}
                        initial='normal'
                        whileHover='hover'
                        onClick={showNext}
                    >
                        <span> 〉 </span>
                    </SliderBtnNext>
                </AnimatePresence>
            </Slider>
        </SliderWrapper>
    )
}

export default NowPlaying