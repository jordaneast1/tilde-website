import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

const Gallery = styled.section`
  background-color: white;
  color: black;
  width: 98%;
  position: relative;
  padding: 1%;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  margin: auto;

  /* Medium screens */
@media all and (max-width: 800px) {
  .navigation {
    /* When on medium sized screens, we center it by evenly distributing empty space around items */
    justify-content: space-around;
  }
}

  

/* Small screens */
@media all and (max-width: 500px) {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  
}
`;
const GalleryItem = styled(Link)`
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

export const Work = () => {
  return (
    <div id="work-header" className="page">
      <Gallery data-aos="fade-down">
        <div className="page-full">
          <h2>Work</h2>
        </div>
        <div className="frame" data-aos="fade-up"></div>

        <GalleryItem to="/meetingHill/" state={{ modal: true, }} >
          <h1>Meeting Hill</h1>
          <GalleryImage src="meetingHill.jpg"></GalleryImage>
          <p>
            Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. 
          </p>
        </GalleryItem>

        <GalleryItem to="/fila/" state={{ modal: true, }} >
          <h1>FILA</h1>
          <GalleryImage src="meetingHill.jpg"></GalleryImage>
          <p>
            Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. 
          </p>
        </GalleryItem>

        <GalleryItem to="/spark-ar/" state={{ modal: true, }} >
          <h1>Spark AR</h1>
          <GalleryImage src="meetingHill.jpg"></GalleryImage>
          <p>
            Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. 
          </p>
        </GalleryItem>

        <GalleryItem to="/edge-of-the-present/" state={{ modal: true, }} >
          <h1>Edge Of The Present</h1>
          <GalleryImage src="meetingHill.jpg"></GalleryImage>
          <p>
            Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. 
          </p>
        </GalleryItem>

        <GalleryItem to="/skate/" state={{ modal: true, }} >
          <h1>SKATE</h1>
          <GalleryImage src="meetingHill.jpg"></GalleryImage>
          <p>
            Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. 
          </p>
        </GalleryItem>

      </Gallery>
    </div>
  );
};
