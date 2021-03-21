import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing";

const ArtworkPage = styled.section`
  background-color: white;
  margin: 60px 30px 0px 30px;

`

const Head = styled.div`
  margin: 0px 30px;
`

const Head2 = styled.div`
  position: relative;
  top: -30px;
`

const Body = styled.div`
  color: #aaa;
  max-width: 80%;
  margin-left:10%;
  h2 {
    color: black;
  }
  p {
    color: black;
    
  }
`

const Images = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 70%;
    margin-bottom:5px;
  }
`;

const StyledLink = styled(Link)`
  color: darkgrey;
  text-decoration: none;

  :hover{
    color: black;
  }
`
const modalStyle = {
  position: "absolute",
  inset: "80px",
  border: "1px solid rgb(204, 204, 204)",
  background: "rgb(255, 255, 255)",
  overflow: "auto",
}



const ModalArtworkPage = ( { title, description, imageUrls}) => (
  <ModalRoutingContext.Consumer>
    {({ modal, closeTo }) => (
      
      <ArtworkPage>
        <Head>
        {modal ? (
          <StyledLink to={closeTo} state={{ noScroll: true }}>
            &#10006;
          </StyledLink>
        ) : (
          <Head2>
            <h1>
              <StyledLink to="/">Tilde Visual</StyledLink> / <StyledLink to="/#work-header">Work</StyledLink> / {title} ↴
            </h1>
          </Head2>
        )}
        </Head>

        <Body>
          
          <h2>{title}</h2>
          <p>{description}</p>
          <Images>
          {imageUrls && imageUrls.map((url, i) => <img src={url} key={i} />)}
          </Images>
        </Body>
      </ArtworkPage>
    )}
  </ModalRoutingContext.Consumer>
);

export default ModalArtworkPage;

