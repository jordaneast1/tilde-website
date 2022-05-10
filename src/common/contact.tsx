import * as React from "react"
import styled from "styled-components"
import "../pages/styles.css"

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
        <p>We'd love to hear from you.</p>

          <form method="post" action="https://getform.io/f/b2090e42-66a3-413d-a437-d39eacd299b8">
          ...
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            Name
            <input type="text" name="name" />
          </label>
          <label>
            Message
            <input type="text" name="message" />
          </label>
          ...
          <button type="submit">Send</button>
        </form>
      </ContactPage>
      
  </div>
  )
}
