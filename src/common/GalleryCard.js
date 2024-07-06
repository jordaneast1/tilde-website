  import styled from "styled-components";
  import { Link } from "gatsby";
  import PropTypes from "prop-types";
  import "../pages/styles.css";
  import React, { useState, useEffect } from 'react';

  import slugify from 'react-slugify';

  const GalleryItemLink = styled(Link)`
  background-color: black;
  color: white;
  z-index: 0;

  //width + margin *4 should equal 100%
  width: 32.8%;
  height: 32.8 * 0.5625%
  margin: .25%;
  text-decoration: none;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  filter: grayscale(100%);
  transform-origin: left;

  @keyframes scale {
    0% {
      transform: scaleX(0.8);
      transform: translateX(-2%);
    }
    100% {
      transform: scaleX(1);
      transform: translateX(0);
    }
  }
  animation: 0.3s ease-out 0s 1 scale;

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

  &:hover {
    background-color: lightgrey;
    filter: grayscale(0%);
    .hchild {
      opacity:1;
      color:white
    }
    
  }

  .hchild {
      position: absolute;
      text-align: center;
      margin: 0px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity:1;
      transition: 0.3s;
      color:black;
    }
  `;

  const GalleryImage = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
  `


  const useWidthPercentage = (indexProp,  category, isFiltered) => {
    const [widthPercentage, setWidthPercentage] = useState('32.8%');

    const handleResize = () => {
        const width = window.innerWidth;
        //console.log(`indexProp: ${indexProp}, category: ${category}, isFiltered: ${isFiltered}, width: ${width}`);
        //find items at the first index, given that the category is selected
        if (indexProp === 0 && !isFiltered){
          if (width <= 500) {
              setWidthPercentage('99.8%'); //same as
          } else if (width <= 800) {
              setWidthPercentage('47.8%');
          } else {
              setWidthPercentage('30.8%');
          }
        } else {
          if (width <= 500) {
            setWidthPercentage('99.8%'); //same as
          } else if (width <= 800) {
              setWidthPercentage('49.8%');
          } else {
              setWidthPercentage('32.8%');
          }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        // Set initial width percentage
        handleResize();
        
        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return widthPercentage;
  };

  const GalleryCard = ({ title, linkText, imageUrl, link, category, indexProp, isFiltered} ) => {
      
      const widthPercentage = useWidthPercentage(indexProp, category, isFiltered);

      const slugLink = slugify(link)
      console.log(slugify(slugLink))

      return (
        <GalleryItemLink to={slugLink} state={{ modal: true }} style={{ width: widthPercentage }}>
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
      category: PropTypes.string.isRequired,
      indexProp: PropTypes.number,
      isFiltered: PropTypes.bool,
      selectedCategory: PropTypes.string
    };
      
  export default GalleryCard;