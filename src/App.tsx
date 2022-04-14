import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import TV from './Routes/TV';
import Movies from './Routes/Movies';


function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/*' element={<Home/>}/>
        <Route path='movies/:movieId' element={<Home/>}/>
        <Route path='tv/:tvId' element={<Home/>}/>
        <Route path='/tv' element={<TV/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/movies' element={<Movies/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
