import * as React from "react";
import styled from "styled-components";
import GalleryCard from "../common/GalleryCard"


const CenteredDiv = styled.div`
display: flex;
height:50vw;
`;
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
    /* When on medium ssized screens, we center it by evenly distributing empty space around items */
    justify-content: space-around;
  }
}

  

/* Small screens */
@media all and (max-width: 500px) {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  
}
`;

const Work = () => {
  return (
    <div id="work-header" className="page" data-aos="fade-down">
        <div className="page-full" >
          {/* <h2>Work</h2> */}
          <CenteredDiv>
            <iframe src="https://www.youtube.com/embed/6ltKJ6FvQZY?modestbranding=1&autohide=1&showinfo=0&controls=1&rel=0&autoplay=0" width="100%" height="auto" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture;" allowFullScreen ></iframe>
          </CenteredDiv>

        
      <Gallery>
        
        {/* <div className="frame" data-aos="fade-up"></div> */}

        <GalleryCard
          title="Meeting Hill"
          imageUrl="meetingHill.jpg"
          link="/meetingHill/"
          linkText="Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. "
          >
        </GalleryCard>

        <GalleryCard
          title="Singularity"
          imageUrl="Singularity-Edit.gif"
          link="/Singularity/"
          linkText="Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. "
          >
        </GalleryCard>

        <GalleryCard
          title="Edge Of The Present"
          imageUrl="meetingHill.jpg"
          link="/EdgeOfThePresent/"
          linkText="Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. "
          >
        </GalleryCard>

        <GalleryCard
          title="Skate"
          imageUrl="meetingHill.jpg"
          link="/Skate/"
          linkText="Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. "
          >
        </GalleryCard>

        <GalleryCard
          title="SparkAR"
          imageUrl="meetingHill.jpg"
          link="/SparkAR/"
          linkText="Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
            code of conduct Shiver me timbers. "
          >
        </GalleryCard>

      </Gallery>
      </div>
    </div>
  );
};

export default Work;