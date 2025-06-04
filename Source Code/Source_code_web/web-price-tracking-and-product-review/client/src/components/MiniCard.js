import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'

import ProductCard from './ProductCard'
const myHeaders = new Headers({
  "Content-Type": "application/json",
  Accept: "application/json"
});

const MiniCard = (props) => {
  const [showProductCard, setShowProductCard] = useState(false);
  const [newLaptop, setNewLaptop] = useState({});
  const [fetchLaptop, triggerFetchLaptop] = useState(false);
  var laptop = props.laptop;
  useEffect(() => {
    if (fetchLaptop) {
      setNewLaptop(props.laptop)
  }
  }, [fetchLaptop]
  );

  const showCard = () => {
    if (showProductCard == false) {
      triggerFetchLaptop(true);
      setShowProductCard(true);
    }
  }
  const hideCard = () => {
    if (showProductCard) {
      setShowProductCard(false);

    }
  }

  
  var imageClass = 'sneaker-image';
  var sneakerImage = 'https://cf.shopee.vn/file/'+laptop.image;
  var sneakerImages = 'https://cf.shopee.vn/file/'+laptop.images;
  


  var len= Object.keys(laptop.review_price).length;
  const price1 = laptop.review_price[len-1].price;
  const price =price1*0.0001*0.1;
  var dayupdate=laptop.review_price[len-1].DayUpdate;



  const CardText = () => {
    if (price) {
      return (
         <Card.Text class='mini-card-text'>
           <div class='mini-card-price'>{(price).toLocaleString('de-DE', { style: 'currency', currency: 'VND' })} <span class='on-text'></span></div>
         </Card.Text>
    );
  }
  else{
    return(
      <Card.Text class='mini-card-text'>
        <div>Not Available</div>
      </Card.Text>

      );
    }

  }

  


    return(
      <a onClick={showCard} style={{ cursor: 'pointer' }} class='card-button'>
        <Card class='mini-card' border="light" tag="a" style={{ cursor: "pointer" }}
          style={{ width: '15rem', height: '20rem' }}>
          <Card.Img class={imageClass} variant="top" src={sneakerImage} />
          <Card.Body class='mini-card-body'>
            <Card.Title class='card-title'>{laptop.name}</Card.Title>
            <CardText />
          </Card.Body>
        </Card>

        {fetchLaptop && <ProductCard laptop={newLaptop} name={laptop.name} 
          // InfoName={laptop.InfoName} InfoText={laptop.InfoText} 
          atribute={laptop.attributes} imageClass={imageClass} images={sneakerImages} minPriceLink={laptop.url} minPrice={price} giaHT={laptop.review_price} dayUpdate={dayupdate}
          show={showProductCard} onHide={hideCard} des={laptop.description} id={laptop.itemid} no_sale={laptop.historical_sold}></ProductCard>
        }
      </a>
    );
}
export default MiniCard;