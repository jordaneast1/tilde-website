import * as React from "react";
import styled from 'styled-components'
import { StaticImage } from "gatsby-plugin-image"



const StyledDiv = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: url('/meetingHill.jpg');
  background-size:cover;
  background-position: center;
  background-color: #000000;

`

const MobileCanvas = () => {
   return ( <div>
   <StyledDiv >
    <StaticImage 
    src="images/media/_Art/MeetingHill/meetingHill.jpg" 
    alt="A dinosaur" 
    style = {'background-size:cover; background-position: center; background-color: #000000;'}
    />
    </StyledDiv>
    </div>
   );
}

export default MobileCanvas
