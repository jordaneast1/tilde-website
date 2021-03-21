import React from "react";
import ModalArtworkPage from "../common/ModalArtworkPage"
import styled from "styled-components";


const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const MeetingHill = () => {
  return (
    <ModalArtworkPage
    title="Meeting Hill"
    imageUrls={["/meetingHill.jpg","/MeetingHillprogramming.png"]}
      description={
        <div>
          Meeting Hill was created to be a place to share music, panels, interviews with local artists and collectives, DJ sets and other selected audio pieces.
          Over the two week period, a program was broadcasted live over the internet via AzuraCast (a free online radio host), with Meeting Hill as the social and visual platform for the artists.
          <br/>
          <br/>
          Meeting Hill was created utilizing various web technlogies such as Three.js, positional audio (WebAudio API) and AzuraCast, with the backend created with node.js and socket.io and hosted on DigitalOcean.
          <br/>
          M̶e̶e̶t̶i̶n̶g̶ ̶H̶i̶l̶l̶ ̶i̶s̶ ̶c̶u̶r̶r̶e̶n̶t̶l̶y̶ ̶l̶i̶v̶e̶ ̶a̶t̶ ̶h̶t̶t̶p̶:̶/̶/̶t̶i̶l̶d̶e̶v̶i̶s̶u̶a̶l̶.̶t̶v̶/̶.̶
          <br/>
          <br/>
          A few of the talks hosted can be found <a href="https://www.youtube.com/channel/UC74dK8YYStoCs00IqA5Hgrg">here</a>, and a video of the opening set by DJ Sparkle Nymph can be seen below:
          <br/>
          <br/>

          <CenteredDiv>
            <iframe src="https://player.vimeo.com/video/517996605" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
          </CenteredDiv>
        </div>
      }
    />
  )
}
export default MeetingHill;
