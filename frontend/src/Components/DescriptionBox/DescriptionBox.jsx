import React from 'react'
import './DescriptionBox.css'
export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
       <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
       </div>
       <div className="descriptionbox-description">
        <p>eCommerce website is an online portal that facilitates online transactions of goods and services through means of the transfer of information and funds over the Internet.</p>
        <p>An ecommerce website is an online store where customers can find products, browse offerings, and place purchases online. It facilitates the transaction between a buyer and seller.</p>
       </div>
    </div>
  )
}
