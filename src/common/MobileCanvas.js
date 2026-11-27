import * as React from "react";
import styled from 'styled-components'
import { StaticImage } from "gatsby-plugin-image"

// Lightweight fixed background used instead of the 3D splat scene on
// phones (see index.tsx).
const StyledDiv = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000000;
`

const MobileCanvas = () => {
  return (
    <div>
      <StyledDiv>
        <StaticImage
          src="../images/media/_Art/MeetingHill/meetingHill.jpg"
          alt=""
          layout="fullWidth"
          style={{ width: "100%", height: "100%" }}
          imgStyle={{ objectFit: "cover", objectPosition: "center" }}
        />
      </StyledDiv>
    </div>
  );
}

export default MobileCanvas
