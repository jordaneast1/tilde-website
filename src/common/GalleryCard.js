import styled from "styled-components";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import "../pages/styles.css";
import React, { useState, useEffect, useRef } from 'react';
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
    /* without a width the title shrinks to half the tile and wraps early */
    width: 90%;
    font-size: clamp(15px, 2vw, 28px);
    opacity: 1;

    @media all and (max-width: 500px) {
      font-size: 20px;
    }
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

// Stand-in for a missing or failed image: a black 16:9 frame, so the card
// keeps a proper height and the grid stays intact.
const GalleryImageFallback = styled.div`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: black;
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
      allFile(filter: { extension: { regex: "/(jpg|jpeg|png|gif|webp)/" }, sourceInstanceName: { eq: "images" } }) {
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

  // Set if the image fails to load in the browser (e.g. network error).
  const [loadFailed, setLoadFailed] = useState(false);
  const onImageError = () => setLoadFailed(true);

  // The image is in the server-rendered HTML, so it can fail before React
  // hydrates and attaches onError, and gatsby-plugin-image swaps in new <img>
  // elements as it hydrates. So: check whether the image already finished
  // broken, and catch later failures with a capture-phase listener on the
  // wrapper (image error events don't bubble, but capture still sees them).
  const contentRef = useRef(null);
  useEffect(() => {
    const wrapper = contentRef.current;
    if (!wrapper) return;
    const mainImg = wrapper.querySelector('img[data-main-image]') ||
      wrapper.querySelector('img:not([data-placeholder-image])');
    if (mainImg && mainImg.complete && mainImg.naturalWidth === 0 && mainImg.currentSrc) {
      setLoadFailed(true);
      return;
    }
    const onCapturedError = (event) => {
      const el = event.target;
      // ignore the tiny inline placeholder; only the real image matters
      if (el.tagName === 'IMG' && !el.hasAttribute('data-placeholder-image')) setLoadFailed(true);
    };
    wrapper.addEventListener('error', onCapturedError, true);
    return () => wrapper.removeEventListener('error', onCapturedError, true);
  }, []);

  let content = null;
  if (imageNode && !loadFailed) {
    if (imageNode.childImageSharp) {
      const image = getImage(imageNode.childImageSharp.gatsbyImageData);
      content = <GatsbyImage image={image} alt={linkText} onError={onImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }} />;
    } else if (imageNode.publicURL) {
      content = <PublicURLImage src={imageNode.publicURL} alt={imageUrl} onError={onImageError} />;
    }
  }

  const isFallback = content === null;
  if (isFallback) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`GalleryCard: image for "${title}" ${loadFailed ? 'failed to load' : 'not found'}: ${imageUrl}`);
    }
    content = <GalleryImageFallback aria-hidden="true" />;
  }

  return (
    <GalleryItemLink to={slugLink} state={{ modal: true }} style={{ width: widthPercentage }}>
      {/* titles are black until hover; keep them readable on the black fallback */}
      <h1 className="hchild" style={isFallback ? { color: 'white' } : undefined}>{title}</h1>
      <div ref={contentRef} style={{ display: 'contents' }}>{content}</div>
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
