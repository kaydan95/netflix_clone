import styled from 'styled-components';
import NowPlaying from './Slider/MovieSlider/NowPlaying';
import PopularMovie from './Slider/MovieSlider/PopularMovie';
import Trending from './Slider/Trending';
import PopularTv from './Slider/TvSlider/PopularTv';


// styled-components
const SliderContainer = styled.div`
    display : flex;
    flex-direction: column;
    top : -110px;
    position: relative;
`

function HomeSliders() {

    return (
        <SliderContainer>
            <Trending/>
            <PopularMovie/>
            <PopularTv/>
            <NowPlaying/>
        </SliderContainer>
    )
}

export default HomeSliders