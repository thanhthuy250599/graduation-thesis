
import MiniCard from './MiniCard'
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const Trending = () =>{

  const [loading, setLoading] = useState(true);
  const [seeAll, setSeeAll] = useState(false);
  const [sneakers, setSneakers] = useState([]);
  const [allSneakers, setAllSneakers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => { 
    setErrorMessage(null) 
    fetch("http://localhost:5000/product/find/getCate/query=",{method:"GET"}, {
      headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json"}),
    })
      .then(response => response.json())
      .then(jsonResponse => {
        console.log(seeAll)
        setSneakers(jsonResponse.slice(0,10));
        setAllSneakers(jsonResponse);
        setLoading(false);
       
      })
      .catch(err => setErrorMessage("Could not connect to the Shopee-API"));
  }, [seeAll]);

  const handleClick = () => {
    setSeeAll(true);
    setTimeout(()=>{
      window.scrollTo({
        top:625,
        behavior: 'smooth'
      })
    }, 1)
  }  

  const display = () => {
    if(seeAll){
      return(
        allSneakers.map((sneaker, index) => (
          <MiniCard key={`${index}-${sneaker.Ten}`} sneaker={sneaker} />)
          )
      )
    }
    else{
      return(
        sneakers.map((sneaker, index) => (
          <MiniCard key={`${index}-${sneaker.Ten}`} sneaker={sneaker} />))
      )
    }
  }



  return(
    <div class='product-section'>
      <div className="product-section-button"> </div>
    </div>
  )
}

export default Trending;