import * as React from "react";
import styled from "styled-components";

const FullPage1 = styled.section`
  background-color: white;
  color: black;
`;
const HalfPage = styled.section`
  padding: 4%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 42%;
  position: relative;
  overflow: hidden;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;

  @media all and (max-width: 800px) {
    /* On small screens, we are no longer using row direction but column */
    width: 92%
  }
`;


const ProfileBlock = styled.section`
width:100%;
display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
  @media all and (max-width: 800px) {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }
`;

const ProfilePic = styled.img`
  position: relative;
  width: 20rem;
  filter: grayscale(100%);
`;

export const About = () => {
  return (
    <div id="about-header" className="page" >
      <div className="page-full">
      <FullPage1 className="page-full" data-aos="fade-down">
        {/* <div  className="frame"  ></div> */}
        <h1>About us</h1>
        <p>
        (Make more personal)
        Tilde Visual is a creative collaboration between Jordan East and Pat Younis. 
        Together they work on projects in the art, film, music and commercial spheres with a focus on real-time technologies
        </p>
      </FullPage1>

      <ProfileBlock>
          <HalfPage>
          <div className="frame" ></div>
            <h1>Pat</h1>
            <p>
            (Make more personal)

            Pat works between Film, Art and Music with interactive technologies like Unreal Engine to help turn creative ideas into tangible realities through the development of virtual environments.
            Through Film as a part of the Virtual Art Department, collaborating with Artists on installations and Musicians on visuals, Pat's work in the real-time space means digitally problem solving for intuitive and elegant solutions. 
            Pat has created a career that blends a long-time passion for video games and their technologies with a desire to support a range of industries creatively, with a goal to share that experience with others in order to contribute to an exciting, ever-growing community.
            </p>
            <ProfilePic src="/snowPat.jpg"></ProfilePic>
          </HalfPage>


          <HalfPage>
          <div className="frame"></div>
            <ProfilePic src="/jordan.jpg"></ProfilePic>
            <h1>Jordan</h1>
            <p>
              (Make more personal)
            Jordan's practice looks to explore our relationship with technology & with music, through immersive video and augmented physical spaces. 
            His work spans across video, projection, interactive installations and theatre -  often collaborating with improvisational musicians, exploring the intersection of experimental electronic music and video, or interfacing performers and audiences with the work through sensors. 
            It aims to blend the real with virtual, and often includes procedural animation, photogrammetry, real-time generative processes, or workflows that explore the ever-changing landscape of technology. 
            </p>
          </HalfPage>
      </ProfileBlock>
      </div>
    </div>
  );
};
