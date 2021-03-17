import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const GalleryItemLink = styled(Link)`
background-color: black;
color: white;
z-index: 0;
width: 30%;
padding: 1%;
margin: 2px;
text-decoration: none;
-webkit-background-clip: padding-box;
-moz-background-clip: padding-box;
background-clip: padding-box;
filter: grayscale(100%);


/* 2 width */
@media all and (max-width: 800px) {
  width: 45%;  
}

/* Small screens */
@media all and (max-width: 500px) {
  width: 94%;  
}

:hover {
  color: black;
  background-color: lightgrey;
  filter: grayscale(0%);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
`
const GalleryCard = ({ title, linkText, imageUrl, link }) => {
    return (

      <GalleryItemLink to={link} state={{ modal: true, }}>
        <h1>{title}</h1>
        <GalleryImage src={imageUrl}></GalleryImage>
        <p>
          {linkText}
        </p>
      </GalleryItemLink>

    );
  }

GalleryCard.propTypes = {
    imageUrl: PropTypes.string,
    linkText: PropTypes.string,
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
  };
    
export default GalleryCard;