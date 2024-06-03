import * as React from "react";
import styled from 'styled-components'



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
    
    </StyledDiv>
    </div>
   );
}

export default MobileCanvas
