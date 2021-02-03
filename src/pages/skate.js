import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing";

const Image = styled.img`
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: darkgrey;
  text-decoration: none;

  :hover{
    color: black;
  }
`

const modal_skate = () => (
  <ModalRoutingContext.Consumer>
    {({ modal, closeTo }) => (
      <div>
        {modal ? (
          <StyledLink to={closeTo} state={{ noScroll: true }}>
            &#10006;
          </StyledLink>
        ) : (
          <header>
            {" "}
            <h1> Tilde Visual</h1>{" "}
          </header>
        )}

        <h2>SKATE</h2>
        <p>here's some stuff</p>
     <Image src="/meetingHill.jpg"></Image>
      </div>
    )}
  </ModalRoutingContext.Consumer>
);
export default modal_skate;

// const MeetingHill = () => (
//   <div>
//    <h1>MeetingHill</h1>
//    <p>here's some stuff</p>
//    <Image src="/meetingHill.jpg"></Image>
//   </div>
// );
