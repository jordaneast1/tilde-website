import React from "react";
import "../pages/styles.css";
import styled from "styled-components";
import { Link } from "gatsby";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing";


const ArtworkPage = styled.section`
  background-color: #222; //should be same as .ReactModal__Content--after-open in styles.css
  margin: 20px 20px 0px 20px;
`

const Head = styled.div`
  margin: 40px 20px;
`

const Head2 = styled.div`
  position: relative;
  top: -30px;
`

const Body = styled.div`
  color: #222;
  max-width: 80%;
  margin-left:10%;
  h2 {
    color: white;
  }
  p {
    color: white;
    
  }
`

const Images = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 100%;
    margin-bottom:5px;
  }
`;

const StyledLink = styled(Link)`
  color: darkgrey;
  text-decoration: none;

  :hover{
    color: white;
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

