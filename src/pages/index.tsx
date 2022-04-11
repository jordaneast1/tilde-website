import React, { useEffect } from "react";

import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import "./styles.css";
import { About } from "../common/about";
import  Work  from "./Work";
import { Contact } from "../common/contact";
import Nav from "../common/Nav";
import { Footer } from "../common/footer"

import styled from "styled-components";

import MainCanvas from "../common/MainCanvas";

import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
// AOS.init();


const seo = {
  url: "https://tildevisual.tv",
  title: "Tilde Visual",
  description: "Tilde Visual - Realtime Artists",
  favicon: "/favicon.ico",
};

const Blank = styled.section `
width: 100%;
height: 100vh;
`

const Blank2 = styled.section `
width: 100%;
height: 60vh;
`

const ArrowDown = styled(Link)`
width: 25px;
height: 25px;
position:fixed;
top: 90%;
left: 50%;
align-self:center;
display: block;
color: white;
text-decoration:none;
font-size: 60px;
/* border: solid white; */
/* border-width: 0 2px 2px 0; */
/* transform: rotate(45deg);  */
/* -webkit-transform: rotate(45deg); */
margin: auto;

`

const home = () => {
  // let AOS;

  useEffect(() => {
    /**
     * Server-side rendering does not provide the 'document' object
     * therefore this import is required either in useEffect or componentDidMount as they
     * are exclusively executed on a client
     */
    const AOS = require("aos");
    AOS.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
      initClassName: "aos-init", // class applied after initialization
      animatedClassName: "aos-animate", // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 50, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    });
  }, []);

  useEffect(() => {
    if (AOS) {
      AOS.refresh();
    }
  });



return (
  <div className="home">
    <title>{seo.title}</title>
    <Helmet title={seo.title}>
      <meta name="description" content={seo.description} />
      <link rel="icon" type="image/png" sizes="64x64" href={seo.favicon} />

      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
    </Helmet>
    
    <MainCanvas />
    
    <Blank><ArrowDown to="/#work-header" data-aos="fade-up" data-aos-mirror="true" >˅</ArrowDown></Blank>
    <Work />
    <Blank2 />
    <About />
    <Footer />
    <Contact />
    <Nav />
  </div>
);}

export default home;
