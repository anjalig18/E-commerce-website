import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assests/star_icon.png";
import star_dull_icon from "../Assests/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

export const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState(null);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart!");
            return;
        }
        addToCart(product.id, selectedSize); // Passing Product ID and Selected Size
        alert(`Added to cart: ${product.name} - Size: ${selectedSize}`);
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt=""/>
                </div>
            </div>

            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_dull_icon} alt=""/>
                    <p>122</p>
                </div>

                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>

                <div className="productdisplay-right-description">
                    A lightweight, usually knitted, pullover shirt, close-fitting with a round neckline and short sleeves, worn as an undershirt and outer garment.
                </div>

                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                            <div 
                                key={size} 
                                className={selectedSize === size ? "selected" : ""}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={handleAddToCart}>ADD TO CART</button>
                <p className='productdisplay-right-category'><span>Category:</span> Women, T-shirt, Crop Top</p>
                <p className='productdisplay-right-category'><span>Tags:</span> Modern, Latest</p>
            </div>
        </div>
    );
};
