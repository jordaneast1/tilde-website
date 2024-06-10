import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import "../pages/styles.css";


const GalleryItemLink = styled(Link)`
background-color: black;
color: white;
z-index: 0;

//width + margin *4 should equal 100%
width: 32.8%;
margin: .25%;
text-decoration: none;
-webkit-background-clip: padding-box;
-moz-background-clip: padding-box;
background-clip: padding-box;
filter: grayscale(100%);
transition: 0.3s;


/* 2 width */
@media all and (max-width: 800px) {
  //width + margin *2 should equal 100%
  width: 49.8%;  
  margin: .1%;
}

/* Small screens */
@media all and (max-width: 500px) {
  //width + margin should equal 100%
  width: 99.8%;
  margin: .2%;  
}


:hover {
  background-color: lightgrey;
  filter: grayscale(0%);
  .hchild {
    opacity:1;
  }
  
}

.hchild {
    position: absolute;
    text-align: center;
    margin: 0px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity:0;
    transition: 0.3s;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
`
const GalleryCard = ({ title, linkText, imageUrl, link }) => {
    return (
      <GalleryItemLink to={link} state={{ modal: true, }}>
          <h1 className="hchild">{title}</h1>
            <GalleryImage src={imageUrl}></GalleryImage>
            {/* <p>
              {linkText}
            </p> */}
      </GalleryItemLink> 
    );
  }

GalleryCard.propTypes = {
    imageUrl: PropTypes.string,
    linkText: PropTypes.string,
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    category: PropTypes.string
  };
    
export default GalleryCard;