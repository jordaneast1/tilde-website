import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing";

const ArtworkPage = styled.section`
  background-color: white;
  margin: 30px 30px 0px 30px;
  border: 15px;

`

const Head = styled.div`

`

const Body = styled.div`
  color: #aaa;
  max-width: 70%;
  margin-left:15%;
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
          <h1>
          <StyledLink to="/">Tilde Visual</StyledLink> / <StyledLink to="/#work-header">Work</StyledLink>
          </h1>
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

