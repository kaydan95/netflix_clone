import styled from 'styled-components';
import HomeSliders from '../Components/HomeSliders';
import Banner from '../Components/Banner';
import ClickedMovieDetailInfo from '../Components/ClickedMovieDetailInfo';
import ClickedTvDetailInfo from '../Components/ClickedTvDetailInfo';

export const HomeWrapper = styled.div`
    height : 100%;
    display: flex;
    position: relative;
    overflow-x : hidden;
    width: 100%;
    overflow-y: auto;
    background-color: ${props => props.theme.black.darker};
    flex-direction: column;
`

const Loader = styled.div`
    height : 20vh;
    align-items : center;
    display : flex;
    justify-content: center;
`


function Home() {

    return (
        <>
            <HomeWrapper>
                <Banner/>
                <HomeSliders/>            
            </HomeWrapper>
            <ClickedMovieDetailInfo/>
            <ClickedTvDetailInfo/>
        </>

    )
}

export default Home