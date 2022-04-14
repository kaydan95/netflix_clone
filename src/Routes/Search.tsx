import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router'
import { GetMovieDetail, GetSearchResult, GetTvDetail, IGetTrendingResult, IMovieDetail, ITvDetail } from '../api';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, BoxIconContainer, BoxIconWrapper, BoxInfo, boxInfoVars, BoxInfoWrapper, BoxKeyWordsContainer, BoxThumbnail, BoxTitle, boxTitleVars, boxVars, IconBtn, LanguageTag, PlayIconBtn, Row, StatusTag } from '../Components/Slider/MovieSlider/NowPlaying';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCircle, faPlay, faPlus, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { makeImage } from '../util';
import ClickedMovieDetailInfo from '../Components/ClickedMovieDetailInfo';
import ClickedTvDetailInfo from '../Components/ClickedTvDetailInfo';

const SearchWrapper = styled.div`
    border : 1px solid white;
    display : flex;
    padding : 100px 50px;
    width : 100%;
    height : 100vh;
    flex-direction: column;
    position: relative;
`

const SearchResultTitle = styled.div`
    p {
        font-size : 2.5rem;
        color : ${props => props.theme.white.darker};
        span {
            font-weight : bold;
            color : ${props => props.theme.white.lighter};
            margin-left: 10px;
            font-style: italic;
        }
    }
`

const SearchResultContents = styled(motion.div)`
    width : 100%;
    margin-top : 20px;
    height: fit-content;
    /* display: flex;
    flex-direction : column; */
    display: grid;
    gap : 15px;
    grid-template-columns: repeat(5, 1fr);
`

const SearchInfoVars = {
    normal : {
        scale : 1,
    },
    hover : {
        scale : 1.3,
        y : -40,
        position : 'absolute',
        zIndex : 10000,
        backgroundColor : "#2F2F2F",
        transition : {
            delay : 0.2,
            duration : 0.2,
            type : "tween",
        }
    }
}



function Search() {

    const loaction = useLocation();
    const keyword = new URLSearchParams(loaction.search).get("keyword");
    const [movieId, setMovieId] = useState(0);
    const [tvId, setTvId] = useState(0);
    const navigate = useNavigate();

    const [isMovie, setIsMovie] = useState(false);

    const [page, setPage] = useState(1);

    const { data : searchResult } = useQuery<IGetTrendingResult>(
        ["searchResult", keyword, page], () => GetSearchResult(keyword!, page)
    );

    const search = searchResult?.results?.filter((content) => {
        if(content.backdrop_path && content.poster_path !== null && content.media_type !== "person"){
            return content;
        }
    })

    const { data:resultMovieDetail } = useQuery<IMovieDetail>(
        ["resultMovieDetail", movieId], () => GetMovieDetail(+movieId!)
    );

    const { data:resultTvDetail } = useQuery<ITvDetail>(
        ["resultTvDetail", tvId], () => GetTvDetail(+tvId!)
    );

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
        <AnimatePresence>
            <SearchWrapper>
                <SearchResultTitle>
                    <p>Search result of <span>"{keyword}"</span></p>
                </SearchResultTitle>
                <SearchResultContents>
                    {search?.map((result) => (
                        <Box key={result.id}
                        variants={boxVars} 
                        whileHover="hover"
                        initial="normal"
                        transition={{type:"tween"}}
                        >
                            <BoxThumbnail 
                                onHoverStart={() => whenBoxHovered(result.id!, result.media_type!)}
                                onClick={()=> whenBoxClicked(result.id!, result.media_type!)}
                                bgphoto={makeImage(result.backdrop_path || result.poster_path, "w500")}>
                                <BoxTitle variants={boxTitleVars}>{result.title}</BoxTitle>
                            </BoxThumbnail>
                            <BoxInfoWrapper variants={boxInfoVars}>
                                <BoxIconContainer>
                                    <BoxIconWrapper>
                                        <PlayIconBtn><FontAwesomeIcon icon={faPlay} /></PlayIconBtn>
                                        <IconBtn><FontAwesomeIcon icon={faPlus} /></IconBtn>
                                        <IconBtn><FontAwesomeIcon icon={faThumbsUp} /></IconBtn>
                                    </BoxIconWrapper>
                                    <IconBtn onClick={()=> whenBoxClicked(result.id!, result.media_type!)}><FontAwesomeIcon icon={faAngleDown} /></IconBtn>
                                </BoxIconContainer>
                                <BoxInfo>
                                    <LanguageTag>{isMovie ? (`${resultMovieDetail?.original_language}`) : (`${resultTvDetail?.original_language}`)}</LanguageTag>
                                    {isMovie ? (
                                        <span style={{margin : '0px 8px'}}>
                                            {Math.floor(+`${resultMovieDetail?.runtime}` / 60)}h {Math.floor(+`${resultMovieDetail?.runtime}` % 60)}m
                                        </span>
                                    ) : (
                                        <span style={{margin : '0px 8px', fontSize : '13px'}}>
                                            {resultTvDetail?.number_of_seasons} {resultTvDetail?.number_of_seasons === 1 ? "Season" : "Seasons"}
                                        </span>
                                    )}
                                    <StatusTag>{isMovie ? (`${resultMovieDetail?.status}`) : (`${resultTvDetail?.status}`)}</StatusTag>
                                </BoxInfo>
                                {isMovie ? (
                                    <BoxKeyWordsContainer>
                                        {resultMovieDetail?.genres?.slice(0,3).filter((genre) => {
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
                                        {resultTvDetail?.genres?.slice(0,3).filter((genre) => {
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
                    ))}
                </SearchResultContents>
                
                <ClickedMovieDetailInfo/>
                <ClickedTvDetailInfo/>
            </SearchWrapper>
        </AnimatePresence>
    )
}

export default Search