import MiniCard from './MiniCard'
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';



const Category = ({ match, location }) => {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json"
    });
    const [loading, setLoading] = useState(true);
    const [laptops, setLaptops] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const {
      params: {
        key
      }
    } = match;

    useEffect(() => {
      setErrorMessage(null)
      setLoading(true);
      window.scrollTo({
        top: 100,
        behavior: 'smooth'
      })
      fetch("http://localhost:5000/product/find/getCate/" + key, {
          headers: myHeaders,
        })
        .then(response => response.json())
        .then(jsonResponse => {
          setLaptops(jsonResponse);
          setLoading(false);
          window.scrollTo({
            top: 625,
            behavior: 'smooth'
          })
        })
        .catch(err => setErrorMessage("No Products Found"));
    }, [location]);

    return(
        <div class='product-section'>
          <h2 class='product-title'> Kết quả tìm kiếm cho <span class="product-key">
            {key == 161 ? 'Giày Dép Nam' : key == 2429 ? 'Giày Dép Nữ' : key == 77 ? 'Thời Trang Nữ' : key == 78 ? 'Thời Trang Nam':'Mặt hàng khác'}
            </span> </h2>
          <div class='product-page'>
            {loading && !errorMessage ? (
            <Spinner class='spinners' animation="border" variant="secondary" role="status"></Spinner>

            ) : errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
            ) : (
            laptops.map((laptop, index) => (

            <MiniCard key={`${index}-${laptop.name}`} laptop={laptop} />
            ))
            )}
          </div>
        </div>
    )
}

export default Category;