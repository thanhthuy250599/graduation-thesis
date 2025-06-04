import './App.css';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import React from 'react';
import BrandIcons from './components/BrandIcons'
import 'bootstrap/dist/css/bootstrap.min.css';
import Trending from './components/Trending';
import Products from './components/Products';
import Category from './components/Category';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import SandalButton from './components/SandalButton';
import FeSandalButton from './components/FeSandalButton';
import ClotherButton from './components/ClotherButton';
import FeClotherButton from './components/FeClotherButton';



const App = () => {
    return (
      <div class='page'>
        <NavBar/>
        <div class='background'>
          <div class='search-title'>
              <div class= 'title'>
              Price Tracking and Product Reviews
              </div>
              <div class= 'subtitle'>
                Search Products and Compare Prices
              </div>
          </div>
          <SearchBar />
          <div className="button-part">
            <SandalButton />
            <FeSandalButton />
            <ClotherButton />
            <FeClotherButton />
          </div>
        </div>
        <Switch>
          <Route exact path={process.env.PUBLIC_URL+'/'} component={Trending}/>
          <Route path={process.env.PUBLIC_URL +'/search/:key'} component={Products}/>
          <Route path={process.env.PUBLIC_URL +'/getCate/:key'} component={Category}/>
        </Switch>
      </div>
    );
}


export default App;
