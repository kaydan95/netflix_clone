import { motion, AnimatePresence, useViewportScroll, useAnimation} from 'framer-motion';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { GetMovieDetail, IMovieDetail, IGetCredits, GetMovieCredits, IGetMoviesResult, GetSimilarMovies } from '../api';
import { makeImage } from '../util';
import { useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';
import { BoxIconContainer, BoxIconWrapper, LanguageTag, StatusTag } from './Slider/MovieSlider/NowPlaying';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus, faVolumeXmark, faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { PlayBtn} from './Banner';
import { useState } from 'react';

export const BigWrapper = styled(motion.div)`
    height : 100vh;
    width : 100%;
    position : absolute;
    top : 0;
    left : 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-y: scroll;
    overflow-x : hidden;
    z-index: 1000;
    .wrapper {
        width : 100%;
        height : fit-content;
        display: grid;
        grid-template-columns: auto 830px auto;
        .left {
            height : 100%;
        }
        .right {
            height : 100%;
        }
    }
`


export const BigDetailInfoWrapper = styled(motion.div)`
    margin-top: 80px;
    width : 830px;
    height : fit-content;
    background-color: ${props => props.theme.black.darker};
    border-radius: 5px;
    color : black;
    display: flex;
    flex-direction : column;
    border-radius: 10px;
    overflow: hidden;
`

export const BigDetailInfoImg = styled.div<{bgPhoto : string}>`
    background-image : linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24)), url(${props => props.bgPhoto});
    background-size : cover;
    background-position : center;
    width : 100%;
    height : 500px;
    display : flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px 40px 50px 40px;
`

export const DetailInfoTitle = styled.h1`
    font-size : 4rem;
    margin-bottom : 10px;
    font-family: 'Vidaloka', serif;
    font-weight: bold;
    color : ${props => props.theme.white.lighter};
`

export const IconBtn = styled.button`
    width : 45px;
    height : 45px;
    border-radius: 50px;
    background-color : rgba(92, 92, 92, 0.2);
    border: 2px solid rgba(120, 120, 120, 0.906);
    color : ${props => props.theme.white.lighter};
    margin-left : 8px;
    display : flex;
    font-size : 1em;
    align-items: center;
    justify-content: center;
    &:hover {
        cursor: pointer;
        border-color: ${props => props.theme.white.darker};
    }
`

export const BigDetailInfoContainer = styled.div`
    width : 100%;
    display : grid;
    grid-template-columns: 60% 40%;
    padding : 0px 40px;
` 

export const InfoOverview = styled.div`
    height : 150px;
    display: flex;
    flex-direction: column;
    p {
        color : ${props => props.theme.white.lighter};
        font-size : 1.1rem;
        padding-right : 5px;
    }
`

export const InfoSummary = styled.div`
    display : inline-flex;
    align-items: center;
    margin-bottom: 20px;
    font-size : 1.1rem;
    span {
        margin-right: 10px;
        color : ${props => props.theme.white.lighter};
    }
`

export const CastGenres = styled.div`
    display : flex;
    flex-direction: column;
    padding : 10px 0px 0px 20px;
    p{
        display : inline-block;
        font-size : 1em;
        color : ${props => props.theme.black.moreLighter};
        margin-bottom: 10px;
        p {
            margin : 0px 2px;
            font-size: 1rem;
            opacity : 0.7;
            color : ${props => props.theme.white.lighter};
            &:last-child {
                p {
                    display: none;
                }
            }
        }
    }
`

export const SimilarContentsBoxContainer = styled.div`
    width : 100%;
    height : fit-content;
    padding : 50px 40px;
    margin-top: 30px;
    display : flex;
    flex-direction: column;
    h1 {
        font-size : 1.5em;
        font-weight : bold;
        color : ${props => props.theme.white.lighter}
    }
`

export const SimilarContentsBoxWrapper = styled(motion.div)`
    width : 100%;
    /* height : 300px; */
    display: grid;
    margin : 20px 0px 20px 0px;
    gap : 10px;
    overflow-y: hidden;
    position: relative;
    grid-template-columns: repeat(3,1fr);
`

export const SimiliarContentBox = styled.div`
    background-color: ${props => props.theme.black.lighter};
    width : 240px;
    height : 380px;
    border-radius: 5px;
    display : flex;
    flex-direction: column;
    overflow: hidden;
    &:hover {
        cursor: pointer;
    }
    &:first-child &:last-child {
        margin : 0px;
    }
`

export const SimilarContentBox_Thumbnail = styled.div<{bgphoto : string}>`
    background-image : linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 0.5)), url(${props => props.bgphoto});
    background-size : cover;
    background-position: center;
    width : 100%;
    height : 150px;
    color : ${props => props.theme.white.lighter};
    display : flex;
    align-items: flex-end;
    padding : 0px 5px 20px 20px;
    font-size : 1.2em;
    font-weight: bold;
    p {
        margin: 0 auto;
        font-weight: normal;
        color : ${props => props.theme.black.moreLighter};
    }
`

export const SimilarContentBox_Info = styled.div`
    padding : 20px;
    color : ${props => props.theme.white.lighter};
    display : flex;
    flex-direction: column;
    div {
        position: relative;
        display: inline-flex;
        align-items: flex-end;
        padding: 20px 0px;
        span {
            margin-left: 10px;
        }
    };
`

export const ShowMoreBtnBar = styled.div`
    height : 2px;
    background-color : rgba(255, 255, 255, 0.371);
    width : 100%;
    display: flex;
    align-items: center;
    z-index: 1;
    justify-content: center;
`

export const BigDetailTotalInfo = styled.div`
    width : 100%;
    padding : 40px;
    color : ${props => props.theme.white.darker};
    span {
        font-size: 2rem;
        font-weight : bold;
        color : ${props => props.theme.white.lighter};
        span {
            font-weight: normal;
        }
    }
`

export const TotalInfoTable = styled.table`
    margin-top: 20px;
    width : 100%;
    tr {
        margin-bottom: 20px;
        height : 30px;
        text-align : left;
        th {
            width : 9%;
            color : ${props => props.theme.black.moreLighter};
        }
        td {
            display: inline-flex;
            p {
                display: inline-flex;
                margin-right : 3px;
                &:last-child {
                    p {
                        display: none;
                    }
                }
            }
        }
    }
`


export const VolumeBtn = styled.button`
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

// variants

export const SimilarContentsVars = {
    normal : {
        height : 600
    },
    open : {
        height : 1180,
        transition : {
            duration : 0.2,
            type : 'tween'
        }
    },
    close : {
        height : 600,
        transition : {
            duration : 0.2,
            type : 'tween'
        }
    }
}

function ClickedMovieDetailInfo() {

    const { scrollY } = useViewportScroll();
    const navigate = useNavigate();
    const moviePathMatch = useMatch("/movies/:movieId");
    const OpenAni = useAnimation();

    const movieId = moviePathMatch?.params.movieId;

    const [isOpen, setIsOpen] = useState(false);

    const { data : MovieData } = useQuery<IMovieDetail>(
        ["movieDetail", movieId], () => GetMovieDetail(+movieId!)
    );

    const { data : MovieCredit } = useQuery<IGetCredits>(
        ["movieCredit", movieId], () => GetMovieCredits(+movieId!)
    );

    const { data : SimilarMovie } = useQuery<IGetMoviesResult>(
        ["similarMovie", movieId], () => GetSimilarMovies(+movieId!)
    );

    const clickOpen = () => {
        setIsOpen((prev) => !prev);
        if(isOpen === false) {
            OpenAni.start("open");
        }
        if(isOpen === true) {
            OpenAni.start('close');
        }
    }

    const overlayClicked = () => navigate("/");

    const MovieDirector = MovieCredit?.crew?.filter((dir) => {
        if(dir.job === "Director"){
            return dir;
        }
    });

    const MovieWriters = MovieCredit?.crew?.filter((dir) => {
        if(dir.job === "Writer"){
            return dir;
        }
    });


    return (
        <AnimatePresence>
            {moviePathMatch ? 
                <BigWrapper
                    style={{top : scrollY.get()}}
                    layoutId={movieId}
                    initial={{opacity:0}}
                    animate={{opacity:1, transition : {duration : 0.2}}}
                >   
                    <div className='wrapper'>
                        <motion.div className='left' onClick={overlayClicked} exit={{opacity:0}} animate={{opacity:1}}/>
                        <BigDetailInfoWrapper>
                            <BigDetailInfoImg bgPhoto={makeImage(MovieData?.backdrop_path || "")}>
                                <DetailInfoTitle>{MovieData?.title}</DetailInfoTitle>
                                <BoxIconContainer>
                                    <BoxIconWrapper>
                                        <PlayBtn style={{width:'15%', height:'45px'}}><FontAwesomeIcon icon={faPlay}/> Play</PlayBtn>
                                        <IconBtn><FontAwesomeIcon icon={faPlus} /></IconBtn>
                                        <IconBtn><FontAwesomeIcon icon={faThumbsUp} /></IconBtn>
                                    </BoxIconWrapper>
                                    <VolumeBtn>
                                        <FontAwesomeIcon icon={faVolumeXmark} />
                                    </VolumeBtn>
                                </BoxIconContainer>
                            </BigDetailInfoImg>
                            <BigDetailInfoContainer>
                                <InfoOverview>
                                    <InfoSummary>
                                        <span>{MovieData?.release_date.slice(0,4)}</span>
                                        <LanguageTag style={{marginRight:'5px'}}>{MovieData?.original_language}</LanguageTag>
                                        <span>{Math.floor(+`${MovieData?.runtime}` / 60)}h {Math.floor(+`${MovieData?.runtime}` % 60)}m</span>
                                        <StatusTag style={{fontSize : '0.9rem', padding : '5px'}}>{MovieData?.status}</StatusTag>
                                    </InfoSummary>
                                    {MovieData?.overview !== "" ? (
                                        <p>{`${MovieData?.overview}`.length > 380 ? `${MovieData?.overview.slice(0,381)}...` : `${MovieData?.overview}`}</p>
                                    ) : (
                                        <p>There is No Overview for this Movie.</p>
                                    )}
                                </InfoOverview>
                                <CastGenres>
                                    <p>casts :  {MovieCredit?.cast.slice(0,3).map((cast) => <p>{cast.name}<p>,</p></p>)} </p>
                                    <p>genres :  {MovieData?.genres.map((genre) => <p>{genre.name}<p>,</p></p>)} </p>
                                    <p>Tagline :  {MovieData?.tagline !== "" ? (<p>{MovieData?.tagline}</p>) : (<p>No Tagline for this Movie.</p>)} </p>
                                </CastGenres>
                            </BigDetailInfoContainer>
                            <SimilarContentsBoxContainer>
                                <h1>Similar Contents</h1>
                                <SimilarContentsBoxWrapper variants={SimilarContentsVars} initial="normal" animate={OpenAni}>
                                    {SimilarMovie?.results.slice(0,9).map((movie) => (
                                        <SimiliarContentBox>
                                            {movie?.backdrop_path !== null ? (
                                                <SimilarContentBox_Thumbnail bgphoto={makeImage(movie.backdrop_path, "w500")}>
                                                    {movie?.title}
                                                </SimilarContentBox_Thumbnail>
                                            ) : (
                                                <SimilarContentBox_Thumbnail bgphoto={makeImage(movie.backdrop_path, "w500")}>
                                                    <p>NO IMAGE</p>
                                                </SimilarContentBox_Thumbnail>
                                            )}
                                            <SimilarContentBox_Info>
                                                <div>
                                                    <LanguageTag>{movie?.original_language}</LanguageTag> 
                                                    <span>{movie?.release_date.slice(0,4)}</span>
                                                    <IconBtn style={{position:'absolute', right : '0', top : '2px'}}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </IconBtn>
                                                </div>
                                                {movie?.overview !== "" ? (
                                                    <p>{ `${movie.overview}`.length > 160 ? `${movie.overview.slice(0, 160)}...` : `${movie.overview}`}</p>
                                                ) : (
                                                    <p>There is No Overview for this Movie.</p>
                                                )}
                                            </SimilarContentBox_Info>
                                        </SimiliarContentBox>
                                    ))}
                                    <div style={{
                                        position :'absolute', 
                                        backgroundImage : 'linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24))', 
                                        bottom : 0, 
                                        height : '30px',
                                        width : '100%'}}/>
                                </SimilarContentsBoxWrapper>
                                <ShowMoreBtnBar>
                                    <IconBtn onClick={clickOpen}>
                                        {isOpen ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </IconBtn>
                                </ShowMoreBtnBar>
                            </SimilarContentsBoxContainer>
                            <BigDetailTotalInfo>
                                <span>{MovieData?.title} <span>Detail</span></span>
                                <TotalInfoTable>
                                    <tr>
                                        <th>Director</th>
                                        <td>{MovieDirector?.map(dir => dir.original_name)}</td>
                                    </tr>
                                    <tr>
                                        <th>Casts</th>
                                        <td>{MovieCredit?.cast.slice(0,5).map((cast) => <p>{cast.name}<p>,</p></p>)}...</td>
                                    </tr>
                                    <tr>
                                        <th>Writer</th>
                                        <td>
                                            {MovieWriters?.map((writer) => <p>{writer.original_name}<p>,</p></p>)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Genres</th>
                                        <td>{MovieData?.genres.map((genre) => <p>{genre.name}<p>,</p></p>)}</td>
                                    </tr>
                                    <tr>
                                        <th>TagLine</th>
                                        {MovieData?.tagline !== "" ? (<td>{MovieData?.tagline}</td>) : (<td>No Tagline for this Movie.</td>)}  
                                    </tr>
                                </TotalInfoTable>
                            </BigDetailTotalInfo>
                        </BigDetailInfoWrapper>
                        <motion.div className='right' onClick={overlayClicked} exit={{opacity:0}} animate={{opacity:1}}/>
                    </div>
                </BigWrapper>
            : null}
        </AnimatePresence>
    
    )
}

export default ClickedMovieDetailInfo