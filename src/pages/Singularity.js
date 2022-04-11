import React from "react";
import ModalArtworkPage from "../common/ModalArtworkPage"
import styled from "styled-components";

const CenteredDiv = styled.div`
display: flex;
height:50vw;
`;

const Singularity = () => {
  return (
    <ModalArtworkPage
    title="Singularity"
    description={
      <div>
      Singularity is an interactive virtual landscape designed to be a digital nexus for the themes of Origin (Parallels). Constructed with the intention to inspire new ways of connecting artworks within exhibitions, Singularity acts as both an independent generative artwork and a bridge between the other artists works using a patchbay controller.
      <br/><br/>
      The user interacts with a custom patch bay to make connections between Singularity and the open ports that represent work from the other artists, and by doing so provides an opportunity for the user to create their own soundscape across the gallery. Interpretations of the other artworks within the space also find their way into the virtual landscape, where the user can amplify their presence within the environment by connecting more cables into the correlating cable jacks.
      <br/><br/>
      Special thanks to Dylan Marelic-Mcintyre for 3D print and laser cutting design schematics for the interface.
      <br/><br/>      <br/><br/>


      <CenteredDiv>
            <iframe src="https://player.vimeo.com/video/526794203" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </CenteredDiv>
      <br/><br/>
      <br/><br/>

      </div>
    }
    imageUrls={["/Singularity1.jpg","/Singularity2.jpg","/Singularity3.jpg","/Singularity4.jpg"]}

    />
  )
}
export default Singularity;
    