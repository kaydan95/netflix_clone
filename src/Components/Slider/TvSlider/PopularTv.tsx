import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { IGetPopularTvResult, GetPopularTvSeries, ITvDetail, GetTvDetail } from '../../../api';
import { makeImage } from '../../../util'
import { Box, BoxIconContainer, BoxIconWrapper, BoxInfo, boxInfoVars, boxTitleVars, BoxInfoWrapper, BoxKeyWordsContainer, BoxThumbnail, BoxTitle, boxVars, btnVars, IconBtn, LanguageTag, PlayIconBtn, Row, rowVars, Slider, SliderBtnNext, SliderBtnPrev, SliderHeader, SliderIndicator, SliderIndicatorWrapper, SliderTitle, SliderWrapper, StatusTag } from '../MovieSlider/NowPlaying'
import { useMediaQuery } from "react-responsive"
import { faPlay, faPlus, faAngleDown, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PopularTv() {

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

    const { data:popularTv } = useQuery<IGetPopularTvResult>(
        ["popularTv", "getPopularTv"], GetPopularTvSeries
    );

    const [popularTvIndex, setPopularTvIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const navigate = useNavigate();
    const [back, setBack] = useState(false);

    const toggleLeaving = () => setLeaving(prev => !prev);

    const showPrevPopularTV = () => {
        if (popularTv){
            if(leaving) return;
            toggleLeaving();
            setBack(true);
            const totalMovies = popularTv.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularTvIndex((prev) => prev === 0 ? maxIndex : prev - 1);
        }
    };

    const showNextPopularTV = () => {
        if (popularTv){
            if(leaving) return;
            toggleLeaving();
            setBack(false);
            const totalMovies = popularTv.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularTvIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };

    const [tvId, setTvId] = useState(0);

    const { data:popularTvDetail } = useQuery<ITvDetail>(
        ["popularTvDetail", tvId], () => GetTvDetail(+tvId!)
    );

    const genresList = popularTvDetail?.genres?.slice(0,3).filter((genre) => {
        return genre.name.length < 18;
    });

    const whenBoxHovered = (tvId : number) => {
        setTvId(tvId);
    }

    const whenBoxClicked = (tvId : number) => {
        navigate(`/tv/${tvId}`);
    }


    return (
        <SliderWrapper>
            <SliderHeader>
                <SliderTitle>Popular in Tv Series</SliderTitle>
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
                        key={popularTvIndex}
                    >
                        {popularTv?.results
                            .slice(offset*popularTvIndex, offset*popularTvIndex+offset)
                            .map((tv) => (
                                <Box key={tv.id}
                                variants={boxVars} 
                                whileHover="hover"
                                initial="normal"
                                transition={{type:"tween"}}
                                // layoutId={movie.id + ""}
                                >
                                    <BoxThumbnail
                                        onHoverStart={() => whenBoxHovered(tv.id)} 
                                        onClick={()=> whenBoxClicked(tv.id)}
                                        bgphoto={makeImage(tv.backdrop_path, "w500")}>
                                        <BoxTitle variants={boxTitleVars}>{tv.name}</BoxTitle>
                                    </BoxThumbnail>
                                    <BoxInfoWrapper variants={boxInfoVars}>
                                        <BoxIconContainer>
                                            <BoxIconWrapper>
                                                <PlayIconBtn><FontAwesomeIcon icon={faPlay} /></PlayIconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faPlus} /></IconBtn>
                                                <IconBtn><FontAwesomeIcon icon={faThumbsUp} /></IconBtn>
                                            </BoxIconWrapper>
                                            <IconBtn onClick={()=> whenBoxClicked(tv.id)}><FontAwesomeIcon icon={faAngleDown} /></IconBtn>
                                        </BoxIconContainer>
                                        <BoxInfo>
                                            <LanguageTag>{popularTvDetail?.original_language}</LanguageTag>
                                                <span style={{margin : '0px 8px', fontSize : '13px'}}>
                                                    {popularTvDetail?.number_of_seasons} {popularTvDetail?.number_of_seasons === 1 ? "Season" : "Seasons"}
                                                </span>
                                            <StatusTag>{popularTvDetail?.status}</StatusTag>
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
                        onClick={showPrevPopularTV}
                    >
                        <span> 〈 </span>
                    </SliderBtnPrev>
                    <SliderBtnNext 
                        variants={btnVars}
                        initial='normal'
                        whileHover='hover'
                        onClick={showNextPopularTV}
                    >
                        <span> 〉 </span>
                    </SliderBtnNext>
                </AnimatePresence>
            </Slider>
        </SliderWrapper>
    )
}

export default PopularTv