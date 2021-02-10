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
      <FullPage1 className="page-full" data-aos="fade-down">
        {/* <div  className="frame"  ></div> */}
        <h1>About us</h1>
        <p>
          Holystone red ensign gabion warp lateen sail hearties bowsprit mizzen
          broadside bucko. To go on account flogging parrel draught interloper
          aft belaying pin bowsprit topsail brig. Pillage stern line quarter
          Pieces of Eight heave down broadside gibbet killick case shot.
        </p>
      </FullPage1>

      <ProfileBlock>
 

          <HalfPage>
          <div className="frame" ></div>
            <h1>Pat</h1>
            <p>
              Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder
              code of conduct Shiver me timbers. Buccaneer black jack topmast
              chase guns reef Shiver me timbers matey lugger landlubber or just
              lubber pinnace. Measured fer yer chains ye execution dock Brethren
              of the Coast spirits topmast chantey Jolly Roger fathom holystone.
            </p>
            <ProfilePic src="/snowPat.jpg"></ProfilePic>
          </HalfPage>


          <HalfPage>
          <div className="frame"></div>
            <ProfilePic src="/jordan.jpg"></ProfilePic>
            <h1>Jordan</h1>
            <p>
              Gold Road fluke pink no prey, no pay loot Nelsons folly dead men
              tell no tales cutlass topsail hail-shot. Line pillage deadlights
              sheet take a caulk interloper parrel Admiral of the Black wherry
              pressgang. Draught run a shot across the bow hulk coffer boom long
              clothes list six pounders walk the plank Jack Tar.
            </p>
          </HalfPage>
      </ProfileBlock>
    </div>
  );
};
