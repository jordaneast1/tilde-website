import React from "react";
import styled from "styled-components";
import { Link, graphql } from "gatsby";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing-v5.0";
import "./styles.css";

const ArtworkPage = styled.section`
  background-color: #222; // should match .ReactModal__Content--after-open in styles.css
  margin: 20px 20px 0px 20px;
  inset:5px;
`;

const Head = styled.div`
  margin: 15px 15px;
  position: relative;
  font-size:15px;
  
  @media all and (max-width: 500px) {
     font-size:10px;
  }
`;

const Head2 = styled.div`
  position: relative;
  top: -25px;

  @media all and (max-width: 500px) {
      top: 0px;
      color: white;
  }

`;

const Body = styled.div`
  color: white;
  max-width: 80%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  font-size:auto;

  h2 {
    color: white;
  }
  h3 {
    color: lightgrey;
  }
  > p {
    color: white;
    padding-top: 10px;
  }
  > img {
    width:100%;
    margin: 200px;
  }
  a {
    color:lightgrey;
  }
  
  @media all and (max-width: 500px) {
    max-width: 100%;
    margin-left: 5%;

    > img {
      margin: 50px;
    }  
  }
`;

const StyledLink = styled(Link)`
  color: darkgrey;
  text-decoration: none;

  &:hover {
    color: white;
  }

`;

const ModalArtworkPage = ({ data }) => {
  if (!data) return null; // Handle cases where data is undefined

  const { markdownRemark } = data;
  if (!markdownRemark) return null; // Handle cases where markdownRemark is undefined

  const { frontmatter, html } = markdownRemark;

  return (
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
                  <StyledLink to="/">Tilde Visual</StyledLink> /{" "}
                  <StyledLink to="/#work-header">Work</StyledLink> /{" "}
                  {frontmatter.title} ↴
                </h1>
              </Head2>
            )}
          </Head>

          <Body>
            <h2>{frontmatter.title}</h2>
            {frontmatter.subtitle && <h3>{frontmatter.subtitle}</h3>}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Body>
        </ArtworkPage>
      )}
    </ModalRoutingContext.Consumer>
  );
};

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        subtitle
      }
    }
  }
`;

export default ModalArtworkPage;
