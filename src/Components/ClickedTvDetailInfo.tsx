import { AnimatePresence, useViewportScroll, useAnimation, motion} from 'framer-motion';
import { useQuery } from 'react-query';
import { GetTvDetail, ITvDetail, GetTvCredits, IGetCredits, IGetPopularTvResult, GetSimilarTv, GetTvSesasonEpisodes, IGetSeason } from '../api';
import { makeImage } from '../util';
import { useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';
import { BoxIconContainer, BoxIconWrapper, LanguageTag, StatusTag } from './Slider/MovieSlider/NowPlaying';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus, faVolumeXmark, faAngleDown, faAngleUp, faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { PlayBtn } from './Banner';
import { useState } from 'react';
import { BigDetailInfoContainer, BigDetailInfoImg, BigDetailInfoWrapper, BigDetailTotalInfo, BigWrapper, CastGenres, DetailInfoTitle, IconBtn, InfoOverview, InfoSummary, ShowMoreBtnBar, SimilarContentBox_Info, SimilarContentBox_Thumbnail, SimilarContentsBoxContainer, SimilarContentsBoxWrapper, SimilarContentsVars, SimiliarContentBox, TotalInfoTable, VolumeBtn } from './ClickedMovieDetailInfo';
import styled  from 'styled-components';


const SeasonsInfoContainer = styled(motion.div)`
    padding : 40px 40px 20px 40px;
    width : 100%;
    margin-top: 30px;
`

const SeasonInfoTitle = styled.div`
    display: inline-flex;
    align-items: center;
    width : 100%;
    justify-content: space-between;
    margin-bottom: 10px;
    span {
        font-size : 1.5em;
        color : ${props => props.theme.white.lighter};
        font-weight : bold;
        width : fit-content;
    }
`

const SelectSection = styled.div`
    border-radius: 5px;
    width : 130px;
    height : 50px;
    display: flex;
    justify-content: space-around;
    padding : 10px;
    align-items: center;
    font-size : 1.1em;
    font-weight : bold;
    color : ${props => props.theme.white.lighter};
    border : 2px solid ${props => props.theme.black.moreLighter};
    background-color: rgba(60, 60, 60, 0.5);
    &:hover {
        cursor: pointer;
    }
`

const OptionBox = styled(motion.div)`
    width : 200px;
    height : fit-conent;
    display: flex;
    flex-direction : column;
    padding : 10px 0px;
    border : 1px solid ${props => props.theme.black.moreLighter};
    background-color: rgb(46, 46, 46);
    position: absolute;
    right : 0;
    top : 0;
    opacity: 0;
`

const Option = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding : 10px;
    height : 50px;
    color : ${props => props.theme.white.lighter};
    p {
        &:first-child {
            font-weight : bold;
            font-size : 1.1em;
            margin-right: 5px;
        }
    }
    &:hover {
        cursor: pointer;
        background-color: rgba(160, 160, 160, 0.5);
    }
`


const SeasonEpisodesInfo = styled.div`
    display : flex;
    width : 100%;
    flex-direction: column;
    position: relative;
`

const EpisodeBox = styled.div`
    border-bottom: 0.5px solid ${props => props.theme.black.moreLighter};
    border-radius: 5px;
    display: grid;
    width : 100%;
    height : 150px;
    grid-template-columns: 4% 23% 71%;
    color : ${props => props.theme.white.lighter};
    padding : 30px;
    grid-gap: 10px;
    .episodeNumber {
        font-size : 1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &:nth-child(2) {
        border-top: 0.5px solid ${props => props.theme.black.moreLighter};
    }
`

const EpisodeImgBox = styled.div<{bgPhoto : string}>`
    background-image : url(${props => props.bgPhoto});
    background-size : cover;
    background-position : center;
    width : 100%;
    height : 100%;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color : ${props => props.theme.black.moreLighter};
`

const EpisodeInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    .episodeTitle {
        display : inline-flex;
        justify-content: space-between;
        margin-bottom: 10px;
        span {
            font-weight : bold;
            width : fit-content;
            font-size : 1.1rem;
        }
    }
    .episodeOverview {
        color : rgba(229, 229, 229, 0.9);
        align-items: center;
    }
`


// variants
const SelectorVars = {
    normal : {
        opacity : 0
    },
    activate : {
        opacity : 1,
        transition : {
            duration : 0.1,
            type : "tween"
        }
    },
    end : {
        opacity : 0
    }
}

function ClickedTvDetailInfo() {

    const { scrollY } = useViewportScroll();

    const navigate = useNavigate();
    const tvPathMatch = useMatch("/tv/:tvId");
    const OpenAni = useAnimation();
    const OpenSelectorAni = useAnimation();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const tvId = tvPathMatch?.params.tvId;


    const [isOpen, setIsOpen] = useState(false);

    const { data : TvData } = useQuery<ITvDetail>(
        ["tvDetail", tvId], () => GetTvDetail(+tvId!)
    );

    const { data : TvCredit } = useQuery<IGetCredits>(
        ["tvCredit", tvId], () => GetTvCredits(+tvId!)
    );

    const { data : SimilarTv } = useQuery<IGetPopularTvResult>(
        ["SimilarTv", tvId], () => GetSimilarTv(+tvId!)
    );


    const clickSelectorOpen = () => {
        setIsSelectorOpen((prev) => !prev);
        if(isSelectorOpen === false){
            OpenSelectorAni.start('activate');
        }
        if(isSelectorOpen === true){
            OpenSelectorAni.start('end');
        }
    };

    const [currentSeason, setCurrentSeason] = useState(1);

    const { data : TvSeasons } = useQuery<IGetSeason>(
        ["TvSeasons", tvId, currentSeason], () => GetTvSesasonEpisodes(+tvId!, currentSeason)
    );

    const releasedTvSeasons = TvSeasons?.episodes?.filter((season) => {
        if(season.overview !== "" || season.still_path !== null){
            return season;
        }
    });

    const clickChangeCurrentSeason = (currentSeasonNumber : number) => {
        setCurrentSeason(currentSeasonNumber);
        setIsSelectorOpen(false);
        OpenSelectorAni.start('end');
    }

    const clickOpen = () => {
        setIsOpen((prev) => !prev);
        if(isOpen) {
            OpenAni.start("open");
        }
        if(!isOpen) {
            OpenAni.start('close');
        }
    }

    const overlayClicked = () => {
        setCurrentSeason(1);
        navigate("/");
    };

    const TvWriters = TvCredit?.crew?.filter((tvWriter) => {
        if(tvWriter.department === "Writing" || tvWriter.known_for_department === "Writing"){
            return tvWriter;
        }
    });

    return (

        <AnimatePresence>
            {tvPathMatch ? 
                <BigWrapper
                    style={{top : scrollY.get()}}
                    layoutId={tvId}
                    initial={{opacity:0}}
                    animate={{opacity:1, transition : {duration : 0.2}}}
                >
                    <div className='wrapper'>
                        <motion.div className='right' onClick={overlayClicked} exit={{opacity:0}} animate={{opacity:1}}/>
                        <BigDetailInfoWrapper>                                     
                            <BigDetailInfoImg bgPhoto={makeImage(TvData?.backdrop_path || "")}>
                                <DetailInfoTitle>{TvData?.name}</DetailInfoTitle>
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
                                        <span>{TvData?.first_air_date.slice(0,4)}</span>
                                        <LanguageTag style={{marginRight:'5px'}}>{TvData?.original_language}</LanguageTag>
                                        <span style={{margin : '0px 8px', fontSize : '16px'}}>
                                            {TvData?.number_of_seasons} {TvData?.number_of_seasons === 1 ? "Season" : "Seasons"}
                                        </span>
                                        <StatusTag style={{fontSize : '0.9rem', padding : '5px'}}>{TvData?.status}</StatusTag>
                                    </InfoSummary>
                                    {TvData?.overview !== "" ? (
                                        <p>{`${TvData?.overview}`.length > 380 ? `${TvData?.overview.slice(0,381)}...` : `${TvData?.overview}`}</p>
                                    ) : (
                                        <p>There is No Overview for this Series.</p>
                                    )}
                                </InfoOverview>
                                <CastGenres>
                                    <p>casts :  {TvCredit?.cast.slice(0,3).map((tvcast) => <p>{tvcast.name}<p>,</p></p>)} </p>
                                    <p>genres :  {TvData?.genres.map((tvgenre) => <p>{tvgenre.name}<p>,</p></p>)} </p>
                                    <p>Tagline :  {TvData?.tagline !== "" ? (<p>{TvData?.tagline}</p>) : (<p>No Tagline for this Series</p>)} </p>
                                </CastGenres>
                            </BigDetailInfoContainer>
                            <SeasonsInfoContainer>
                                <SeasonInfoTitle>
                                    <span>Episode Information</span>
                                    <SelectSection onClick={clickSelectorOpen}>
                                        <p>Season {currentSeason}</p>
                                        {isSelectorOpen ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
                                    </SelectSection>
                                </SeasonInfoTitle>
                                <SeasonEpisodesInfo>
                                    <OptionBox variants={SelectorVars} initial='normal' animate={OpenSelectorAni}>
                                        {TvData?.seasons.map((season) => (
                                            <Option onClick={() => clickChangeCurrentSeason(season.season_number)}>
                                                <p>Season {season.season_number}</p>
                                                <p>({season.episode_count} Episodes)</p>
                                            </Option>
                                        ))}
                                    </OptionBox>
                                    {releasedTvSeasons?.map((episode) => (
                                        <EpisodeBox className='epiBox'>
                                            <div className='episodeNumber'>{episode.episode_number}</div>
                                            {episode.still_path !== null ? 
                                                <EpisodeImgBox bgPhoto={makeImage(episode.still_path || "")}/> 
                                                : <EpisodeImgBox bgPhoto={makeImage(episode.still_path || "")}> NO IMAGE </EpisodeImgBox>
                                            }
                                            <EpisodeInfoBox>
                                                <div className='episodeTitle'>
                                                    <span>{episode.name}</span>
                                                    <p>{`${episode.air_date}`.slice(0,4) === "2022" ? `${episode.air_date}`.slice(5) : `${episode.air_date}`}</p>
                                                </div>
                                                {episode.overview !== "" ? (
                                                    <div className='episodeOverview'>
                                                        { `${episode.overview}`.length > 160 ? `${episode.overview.slice(0, 160)}...` : `${episode.overview}`}
                                                    </div>
                                                ) : (
                                                    <div className='episodeOverview'>
                                                        There is No Overview for this episode.
                                                    </div>
                                                )}
                                            </EpisodeInfoBox>
                                        </EpisodeBox>
                                    ))}
                                </SeasonEpisodesInfo>
                            </SeasonsInfoContainer>
                            <SimilarContentsBoxContainer>
                                <h1>Similar Contents</h1>
                                <SimilarContentsBoxWrapper variants={SimilarContentsVars} initial="normal" animate={OpenAni}>
                                    {SimilarTv?.results.slice(0,9).map((tv) => (
                                        <SimiliarContentBox>
                                            {tv?.backdrop_path !== null ? (
                                                <SimilarContentBox_Thumbnail bgphoto={makeImage(tv.backdrop_path, "w500")}>
                                                    {tv?.name}
                                                </SimilarContentBox_Thumbnail>
                                            ) : (
                                                <SimilarContentBox_Thumbnail bgphoto={makeImage(tv.backdrop_path, "w500")}>
                                                    <p>NO IMAGE</p>
                                                </SimilarContentBox_Thumbnail>
                                            )}
                                            <SimilarContentBox_Info>
                                                <div>
                                                    <LanguageTag>{tv?.original_language}</LanguageTag> 
                                                    <span>{tv?.first_air_date.slice(0,4)}</span>
                                                    <IconBtn style={{position:'absolute', right : '0', top : '2px'}}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </IconBtn>
                                                </div>
                                                {tv?.overview !== "" ? (
                                                    <p>{ `${tv.overview}`.length > 160 ? `${tv.overview.slice(0, 160)}...` : `${tv.overview}`}</p>
                                                ) : (
                                                    <p>There is No Overview for this series.</p>
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
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        )}
                                    </IconBtn>
                                </ShowMoreBtnBar>
                            </SimilarContentsBoxContainer>
                            <BigDetailTotalInfo>
                                <span>{TvData?.name} <span>Detail</span></span>
                                <TotalInfoTable>
                                    <tr>
                                        <th>Creator</th>
                                        {TvWriters?.length === 0
                                            ? (<td>There is No Creator Information for this series.</td>)
                                            : (<td>{TvWriters?.slice(0,2).map(tvDir => <p>{tvDir.original_name}<p>,</p></p>)}</td>)}
                                    </tr>
                                    <tr>
                                        <th>Casts</th>
                                        <td>{TvCredit?.cast.slice(0,5).map((tvcast) => <p>{tvcast.name}<p>,</p></p>)}...</td>
                                    </tr>
                                    <tr>
                                        <th>Genres</th>
                                        <td>{TvData?.genres.map((genre) => <p>{genre.name}<p>,</p></p>)}</td>
                                    </tr>
                                    <tr>
                                        <th>TagLine</th>
                                        {TvData?.tagline !== "" ? (<td>{TvData?.tagline}</td>) : (<td>No Tagline for this Series</td>)}    
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

export default ClickedTvDetailInfo