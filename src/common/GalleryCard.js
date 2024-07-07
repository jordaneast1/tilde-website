import styled from "styled-components";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import "../pages/styles.css";
import React, { useState, useEffect } from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from 'gatsby';
import slugify from 'react-slugify';

const GalleryItemLink = styled(Link)`
  flex-grow: 1; /* Ensure it grows to fill the available height */

  background-color: black;
  color: white;
  z-index: 0;
  width: 32.8%;
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

  @media all and (max-width: 800px) {
    width: 49.8%;
    margin: .1%;
  }

  @media all and (max-width: 500px) {
    width: 99.8%;
    margin: .2%;
  }

  &:hover {
    background-color: lightgrey;
    filter: grayscale(0%);
    .hchild {
      opacity: 1;
      color: white;
    }
  }

  .hchild {
    position: absolute;
    text-align: center;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    transition: 0.3s;
    color: black;
    z-index: 1;
  }
`;

const PublicURLImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const GalleryImageBroken = styled.div`
  width: 100%;
  height: 100%;
  background-color:white;
`;

const useWidthPercentage = (indexProp, category, isFiltered) => {
  const [widthPercentage, setWidthPercentage] = useState('32.8%');

  const handleResize = () => {
    const width = window.innerWidth;
    if (indexProp === 0 && !isFiltered) {
      if (width <= 500) {
        setWidthPercentage('99.8%');
      } else if (width <= 800) {
        setWidthPercentage('47.8%');
      } else {
        setWidthPercentage('30.8%');
      }
    } else {
      if (width <= 500) {
        setWidthPercentage('99.8%');
      } else if (width <= 800) {
        setWidthPercentage('49.8%');
      } else {
        setWidthPercentage('32.8%');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return widthPercentage;
};

const GalleryCard = ({ title, linkText, imageUrl, link, category, indexProp, isFiltered }) => {
  const widthPercentage = useWidthPercentage(indexProp, category, isFiltered);
  const slugLink = slugify(link);
  
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { extension: { regex: "/(jpg|jpeg|png|gif)/" }, sourceInstanceName: { eq: "images" } }) {
        nodes {
          relativePath
          publicURL
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  `);

  const imageNode = data.allFile.nodes.find(node => node.relativePath === imageUrl);

  let content;
  if (!imageNode) {
    content = <GalleryImageBroken>Image not found</GalleryImageBroken>;
  } else if (imageNode.childImageSharp) {
    const image = getImage(imageNode.childImageSharp.gatsbyImageData);
    content = <GatsbyImage image={image} alt={linkText} 
      style={{ 
        width: '100%', 
        height: '100%',  
        objectFit: 'cover'  
      }} />;
  } else if (imageNode.publicURL) {
    content = <PublicURLImage src={imageNode.publicURL} alt={imageUrl} />;
  } else {
    content = <GalleryImageBroken>Image not processed correctly</GalleryImageBroken>;
  }

  return (
    <GalleryItemLink to={slugLink} state={{ modal: true }} style={{ width: widthPercentage }}>
      <h1 className="hchild">{title}</h1>
      {content}
    </GalleryItemLink>
  );
};

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
