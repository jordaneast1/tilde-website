import * as React from "react"
import styled from "styled-components"


const ContactPage = styled.section`
  background-color: white;
  mix-blend-mode: add;
  color: black;
  height: 300px;
  `  

export const Contact = () => {
  return (
    <div id="contact-header" className="page">
      <ContactPage className="page-full" data-aos="fade-down">
        {/* <div className="frame" data-aos="fade-up"></div> */}
        <h2>Get In Touch!</h2>
        <p>Line loot pinnace ahoy scurvy Jolly Roger squiffy clap of thunder code of conduct Shiver me timbers. 
          Buccaneer black jack topmast chase guns reef Shiver me timbers matey lugger landlubber or just lubber pinnace. 
          Measured fer yer chains ye execution dock Brethren of the Coast spirits topmast chantey Jolly Roger fathom holystone.</p>
      </ContactPage>
      
  </div>
  )
}
