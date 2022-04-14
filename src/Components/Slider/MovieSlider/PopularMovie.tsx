import { AnimatePresence } from 'framer-motion'
import { useState, useEffect} from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { IGetPopularMoviesResult, GetPopularMovies, IMovieDetail, GetMovieDetail } from '../../../api';
import { makeImage } from '../../../util'
import { Box, BoxIconContainer, BoxIconWrapper, BoxInfo, boxInfoVars, boxTitleVars, BoxInfoWrapper, BoxKeyWordsContainer, BoxThumbnail, BoxTitle, boxVars, btnVars, IconBtn, LanguageTag, PlayIconBtn, Row, rowVars, Slider, SliderBtnNext, SliderBtnPrev, SliderHeader, SliderIndicator, SliderIndicatorWrapper, SliderTitle, SliderWrapper, StatusTag } from './NowPlaying'
import { useMediaQuery } from "react-responsive";
import { faPlay, faPlus, faAngleDown, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PopularMovie() {

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

    const { data:popular } = useQuery<IGetPopularMoviesResult>(
        ["popularMovies", "getPopularMovies"], GetPopularMovies
    );

    const [popularIndex, setPopularIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const navigate = useNavigate();
    const [back, setBack] = useState(false);

    const toggleLeaving = () => setLeaving(prev => !prev);

    const showNextPopular = () => {
        if (popular){
            if(leaving) return;
            toggleLeaving();
            setBack(false);
            const totalMovies = popular.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };

    const showPrevPopular = () => {
        if (popular){
            if(leaving) return;
            toggleLeaving();
            setBack(true);
            const totalMovies = popular.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularIndex((prev) => prev === 0 ? maxIndex : prev - 1);
        }
    };


    const [movieId, setMovieId] = useState(0);

    const whenBoxHovered = (movieId : number) => {
        setMovieId(movieId);
    }

    const { data:popularMovieDetail } = useQuery<IMovieDetail>(
        ["popularMovieDetail", movieId], () => GetMovieDetail(+movieId!)
    );

    const genresList = popularMovieDetail?.genres?.slice(0,3).filter((genre) => {
        return genre.name.length < 10;
    });

    const whenBoxClicked = (movieId : number) => {
        navigate(`/movies/${movieId}`);
    }

    return (
        <SliderWrapper>
            <SliderHeader>
                <SliderTitle>Popular in Movies</SliderTitle>
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
                        key={popularIndex}
                    >
                        {popular?.results
                            .slice(offset*popularIndex, offset*popularIndex+offset)
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
                                            <LanguageTag>{popularMovieDetail?.original_language}</LanguageTag>
                                            <span style={{margin : '0px 8px'}}>
                                                {Math.floor(+`${popularMovieDetail?.runtime}` / 60)}h {Math.floor(+`${popularMovieDetail?.runtime}` % 60)}m
                                            </span>
                                            <StatusTag>{popularMovieDetail?.status}</StatusTag>
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
                        onClick={showPrevPopular}
                    >
                        <span> 〈 </span>
                    </SliderBtnPrev>
                    <SliderBtnNext 
                        variants={btnVars}
                        initial='normal'
                        whileHover='hover'
                        onClick={showNextPopular}
                    >
                        <span> 〉 </span>
                    </SliderBtnNext>
                </AnimatePresence>
            </Slider>
        </SliderWrapper>
    )
}

export default PopularMovie