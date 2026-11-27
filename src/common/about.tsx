import * as React from "react";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

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
  /* keeps the inverted text blending against this card only */
  isolation: isolate;
  min-height: 36rem;
  /* text sits at the bottom of the frame */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* Darken the bottom of the photo under the text so the inverted text keeps
     its contrast where it crosses mid-grey parts of the photo (most of the
     card on narrow screens). Sits above the photo (z 0, later in order) and
     below the text (z 1). */
  &::after {
    content: "";
    position: absolute;
    inset: 8px;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0.45) 40%,
      rgba(0, 0, 0, 0) 70%
    );

    /* narrow cards: the text column runs most of the card's height */
    @media all and (max-width: 900px) {
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.75) 0%,
        rgba(0, 0, 0, 0.55) 60%,
        rgba(0, 0, 0, 0.35) 100%
      );
    }
  }

  @media all and (max-width: 800px) {
    /* On small screens, we are no longer using row direction but column */
    width: 92%
  }
`;

// Text sits above the headshot and inverts whatever is behind it, so it
// reads as dark over the light parts of the photo and white over the dark.
const ProfileText = styled.div`
  position: relative;
  z-index: 1;
  color: white;
  mix-blend-mode: difference;
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

// Applied to the StaticImage wrappers below (StaticImage props must be
// static, so it can't be wrapped with styled()). The headshot sits behind
// the text on the right side of the card, filling its full height at its
// natural 2:3 ratio.
// Inset by 8px = the .frame border's 5px offset + 3px width, so the photo
// sits exactly inside the white frame.
const profilePicStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  bottom: 8,
  right: 8,
  height: "calc(100% - 16px)",
  width: "auto",
  aspectRatio: "2 / 3",
  zIndex: 0,
  filter: "grayscale(100%)",
};

export const About = () => {
  return (
    <div id="about-header" className="page" >
      <div className="page-full">
      <FullPage1 className="page-full" data-aos="fade-down">
        {/* <div  className="frame"  ></div> */}
        <h1>About us</h1>
        <p>
        Tilde Visual is a creative collaboration between Jordan East and Pat Younis. 
        Together they work on projects in the art, film, music and commercial spheres with a focus on real-time technologies
        </p>
      </FullPage1>

      <ProfileBlock>
          <HalfPage>
            <StaticImage
              src="../images/headshots/Pat_2026_credit_JacquieManning-36.jpg"
              alt="Pat Younis. Photo: Jacquie Manning"
              width={640}
              style={profilePicStyle}
            />
            <div className="frame" style={{ zIndex: 2 }}></div>
            <ProfileText>
              <h1>Pat</h1>
              <p>
              Pat works between Film, Art and Music with interactive technologies like Unreal Engine to help turn creative ideas into tangible realities through the development of virtual environments.
              Through Film as a part of the Virtual Art Department, collaborating with Artists on installations and Musicians on visuals, Pat's work in the real-time space means digitally problem solving for intuitive and elegant solutions.
              Pat has created a career that blends a long-time passion for video games and their technologies with a desire to support a range of industries creatively, with a goal to share that experience with others in order to contribute to an exciting, ever-growing community.
              </p>
            </ProfileText>
          </HalfPage>


          <HalfPage>
            <StaticImage
              src="../images/headshots/Jordan_2026_credit_JacquieManning-32.jpg"
              alt="Jordan East. Photo: Jacquie Manning"
              width={640}
              style={profilePicStyle}
            />
            <div className="frame" style={{ zIndex: 2 }}></div>
            <ProfileText>
              <h1>Jordan</h1>
              <p>
              Jordan's practice looks to explore our relationship with technology & music, through immersive video and augmented physical spaces.
              His work spans across video, projection, interactive installations and theatre -  often collaborating with improvisational musicians or interfacing performers and audiences through realtime technologies.
              It aims to blend the real with virtual, and often includes procedural animation, photogrammetry, real-time generative processes, or workflows that explore the ever-changing landscape of technology.
              </p>
            </ProfileText>
          </HalfPage>
      </ProfileBlock>
      </div>
    </div>
  );
};
