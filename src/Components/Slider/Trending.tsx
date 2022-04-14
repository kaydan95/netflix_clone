import { AnimatePresence } from 'framer-motion'
import { useMediaQuery } from "react-responsive"
import React, {useState, useEffect} from 'react'
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { GetMovieDetail, GetTrending, GetTvDetail, IGenre, IGetTrendingResult, IMovieDetail, ITvDetail } from '../../api';
import { makeImage } from '../../util'
import { Box, BoxIconContainer, BoxIconWrapper, BoxInfo, boxInfoVars, boxTitleVars, BoxInfoWrapper, BoxKeyWordsContainer, BoxThumbnail, BoxTitle, boxVars, btnVars, IconBtn, LanguageTag, PlayIconBtn, Row, rowVars, Slider, SliderBtnNext, SliderBtnPrev, SliderHeader, SliderIndicator, SliderIndicatorWrapper, SliderTitle, SliderWrapper, StatusTag } from './MovieSlider/NowPlaying'
import { faPlay, faPlus, faAngleDown, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Trending() {

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

    const [trendingIndex, setTrendingIndex] = useState(0);
    const [movieId, setMovieId] = useState(0);
    const [tvId, setTvId] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const navigate = useNavigate();
    const [back, setBack] = useState(false);
    
    const { data:trending } = useQuery<IGetTrendingResult>(
        ["trends", "Trending"], GetTrending
    );

    const { data:trendingMovieDetail } = useQuery<IMovieDetail>(
        ["trendingMovieDetail", movieId], () => GetMovieDetail(+movieId!)
    );

    const { data:trendingTvDetail } = useQuery<ITvDetail>(
        ["trendingTvDetail", tvId], () => GetTvDetail(+tvId!)
    );

    const toggleLeaving = () => setLeaving(prev => !prev);

    const showNextTrend = () => {
        if (trending){
            if(leaving) return;
            toggleLeaving();
            setBack(false);
            const totalMovies = trending.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setTrendingIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };

    const showPrevTrend = () => {
        if (trending){
            if(leaving) return;
            toggleLeaving();
            setBack(true);
            const totalMovies = trending.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setTrendingIndex((prev) => prev === 0 ? maxIndex : prev - 1);
        }
    };

    const [isMovie, setIsMovie] = useState(false);

    const whenBoxHovered = (Id : number, mediaType : string) => {
        if(mediaType === "movie"){
            setIsMovie(true);
            setMovieId(Id);
        } if(mediaType === "tv") {
            setIsMovie(false);
            setTvId(Id);
        }
    }

    const whenBoxClicked = (Id : number, mediaType : string) => {
        if(mediaType === "movie"){
            navigate(`/movies/${Id}`);
        } if(mediaType === "tv") {
            navigate(`/tv/${Id}`);
        }
    };

    return (
        <SliderWrapper>
            <SliderHeader>
                <SliderTitle>Trending</SliderTitle>
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
                        key={trendingIndex}
                    >
                        {trending?.results
                            .slice(offset*trendingIndex, offset*trendingIndex+offset)
                            .map((trend) => (
                                <Box key={trend.id}
                                variants={boxVars} 
                                whileHover="hover"
                                initial="normal"
                                transition={{type:"tween"}}
                                // layoutId={trend.id + ""}
                                >
                                    <BoxThumbnail
                                        onHoverStart={() => whenBoxHovered(trend.id!, trend.media_type!)}  
                                        onClick={()=> whenBoxClicked(trend.id!, trend.media_type!)}
                                        bgphoto={makeImage(trend.backdrop_path, "w500")}>
                                        <BoxTitle variants={boxTitleVars}>{trend.name || trend.title}</BoxTitle>
                                    </BoxThumbnail>
                                    <BoxInfoWrapper variants={boxInfoVars}>
                                        <BoxIconContainer>
                                            <BoxIconWrapper>
                                                <PlayIconBtn><FontAwesomeIcon icon={faPlay} /></PlayIconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faPlus} /></IconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faThumbsUp} /></IconBtn>
                                            </BoxIconWrapper>
                                            <IconBtn onClick={()=> whenBoxClicked(trend.id!, trend.media_type!)}><FontAwesomeIcon icon={faAngleDown} /></IconBtn>
                                        </BoxIconContainer>
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
                                        {isMovie ? (
                                            <BoxKeyWordsContainer>
                                                {trendingMovieDetail?.genres?.slice(0,3).filter((genre) => {
                                                    return genre.name.length < 10
                                                }).map((gen) => (
                                                    <pre>
                                                        {gen.name}
                                                        <button><FontAwesomeIcon icon={faCircle} /></button>
                                                    </pre>
                                                ))}
                                            </BoxKeyWordsContainer>
                                        ) : (
                                            <BoxKeyWordsContainer>
                                                {trendingTvDetail?.genres?.slice(0,3).filter((genre) => {
                                                    return genre.name.length < 18
                                                }).map((gen) => (
                                                    <pre>
                                                        {gen.name}
                                                        <button><FontAwesomeIcon icon={faCircle} /></button>
                                                    </pre>
                                                ))}
                                            </BoxKeyWordsContainer>
                                        )}
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
                        onClick={showPrevTrend}
                    >
                        <span> 〈 </span>
                    </SliderBtnPrev>
                    <SliderBtnNext 
                        variants={btnVars}
                        initial='normal'
                        whileHover='hover'
                        onClick={showNextTrend}
                    >
                        <span> 〉 </span>
                    </SliderBtnNext>
                </AnimatePresence>
            </Slider>
        </SliderWrapper>
    )
}

export default Trending