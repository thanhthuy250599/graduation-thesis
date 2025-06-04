import React from 'react';
import Carousel from 'react-bootstrap/Carousel'
const ImgCarousel = (props) => {
    var laptop = props.laptop;

    const images = () =>{
        if(laptop?.images.length > 0){
            return (
                laptop.images.map(image=>(
                <Carousel.Item>
                    <img class={props.imageClass} src={'https://cf.shopee.vn/file/'+image}></img>
                </Carousel.Item>
            )));}
        else{
            console.log(props);
            return(
                <Carousel.Item>
                    <img class={props.imageClass} src={props.images}></img>
                </Carousel.Item>
            )
        }
    }
    
    return(
        <Carousel>
            {images()}
        </Carousel>
    );
}
export default ImgCarousel