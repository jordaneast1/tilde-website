import * as React from "react";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

// Width of one portrait. The whole About section is sized from this, so it is
// exactly as wide as the two portraits side by side plus the thin border.
const PORTRAIT_WIDTH = "clamp(15rem, 30vw, 26rem)";
const BORDER = "8px";

// Bio items shown (one per line, under the name) when hovering a portrait.
const PAT_BIO = [
  "3D",
  "environment design",
  "animation",
  "niche video game knowledge",
];

const JORDAN_BIO = [
  "programming",
  "exhibition design",
  "particles",
  "niche electronic music knowledge",
];

// Shrinks to fit the portraits and centres itself.
const AboutWrap = styled.div`
  display: grid;
  width: fit-content;
  margin: 0 auto;
  padding: 2% 0;
`;

// The intro box takes the wrapper's width without widening it
// (width: 0 + min-width: 100% stops its text from setting the width).
const Intro = styled.section`
  width: 0;
  min-width: 100%;
  box-sizing: border-box;
  padding: 1.5rem 1.5rem 1rem;
  background-color: white;
  color: black;
`;

// The thin dark band around and between the two portraits.
const ProfileBlock = styled.section`
  display: flex;
  gap: ${BORDER};
  padding: ${BORDER};
  background-color: rgba(0, 0, 0, 0.5);

  @media all and (max-width: 640px) {
    /* side by side would be too small for the bios on phones */
    flex-direction: column;
  }
`;

// Shared by the name and the bio items so they are exactly the same size.
// Scales with the portrait's width (cqi = 1% of the portrait's width).
const TEXT_SIZE = "7cqi";
const PAD = "1.25rem";

// Dark overlay holding the bio list; hidden until hover / tap / focus.
// Top padding leaves room for the name, which stays visible at the top.
const Bio = styled.ul`
  position: absolute;
  inset: 0;
  z-index: 1;
  margin: 0;
  padding: calc(${PAD} + 1.3em + 0.6em) ${PAD} ${PAD};
  list-style: none;
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
  font-size: ${TEXT_SIZE};
  line-height: 1.3;
  opacity: 0;
  transition: opacity 0.3s ease;

  /* each item on its own line; a long item that wraps is still one item */
  li {
    margin: 0 0 0.35em;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Name = styled.h2`
  position: absolute;
  top: ${PAD};
  left: ${PAD};
  right: ${PAD};
  z-index: 2;
  margin: 0;
  color: white;
  font-size: ${TEXT_SIZE};
  line-height: 1.3;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  pointer-events: none;
`;

// One portrait: the photo with the name on it; the bio fades in on hover,
// or on tap / keyboard focus (touch screens have no hover).
const Portrait = styled.div`
  position: relative;
  /* lets the text size above scale with this portrait's width */
  container-type: inline-size;
  width: ${PORTRAIT_WIDTH};
  aspect-ratio: 2 / 3;
  overflow: hidden;
  cursor: default;
  outline: none;

  &:hover ${Bio},
  &:focus ${Bio},
  &:focus-within ${Bio} {
    opacity: 1;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px white;
  }

  @media all and (max-width: 640px) {
    width: min(26rem, calc(100vw - 2.5rem));
  }
`;

// Applied to the StaticImage wrappers (StaticImage props must be static, so
// it can't be wrapped with styled()). Fills the portrait.
const photoStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  filter: "grayscale(100%)",
};

export const About = () => {
  return (
    <div id="about-header" className="page">
      <AboutWrap>
        <Intro data-aos="fade-down">
          <h1>About us</h1>
          <p>
          Tilde Visual is the creative partnerhip of Jordan East and Pat Younis. Our collaboration started with our shared interest in interactive technologies, music and games but grew when we realsied our complementary skillsets covered all bases when building the projects we wanted to make. To be reductive...
          </p>
        </Intro>

        <ProfileBlock>
          <Portrait tabIndex={0}>
            <StaticImage
              src="../images/headshots/Pat_2026_credit_JacquieManning-36.jpg"
              alt="Pat Younis. Photo: Jacquie Manning"
              width={640}
              style={photoStyle}
              imgStyle={{ objectFit: "cover" }}
            />
            <Name>Pat does the...</Name>
            <Bio>
              {PAT_BIO.map((item) => <li key={item}>{item}</li>)}
            </Bio>
          </Portrait>

          <Portrait tabIndex={0}>
            <StaticImage
              src="../images/headshots/Jordan_2026_credit_JacquieManning-32.jpg"
              alt="Jordan East. Photo: Jacquie Manning"
              width={640}
              style={photoStyle}
              imgStyle={{ objectFit: "cover" }}
            />
            <Name>Jordan does the...</Name>
            <Bio>
              {JORDAN_BIO.map((item) => <li key={item}>{item}</li>)}
            </Bio>
          </Portrait>
        </ProfileBlock>
      </AboutWrap>
    </div>
  );
};
