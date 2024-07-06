import * as React from "react"
import styled from "styled-components"
import "../pages/styles.css"
import { useState } from "react"

const ContactPage = styled.section`
  background-color: white;
  mix-blend-mode: add;
  color: black;
  padding: 40px;
  text-align: center;
  `  

export const Contact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: 'StaticForms - Contact Form',
    honeypot: '', // if any value received in this field, form submission will be ignored.
    message: '',
    replyTo: '@', // this will set replyTo of email to email address entered in the form
    accessKey: '54f3960b-45d6-4fc4-bab4-0cd3bfc1619d' // get your access key from https://www.staticforms.xyz
  });

  const [response, setResponse] = useState({
    type: '',
    message: ''
  });

  const handleChange = e =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.staticforms.xyz/submit', {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' }
      });

      const json = await res.json();

      if (json.success) {
        setResponse({
          type: 'success',
          message: 'Thank you for reaching out to us.'
        });
      } else {
        setResponse({
          type: 'error',
          message: json.message
        });
      }
    } catch (e) {
      console.log('An error occurred', e);
      setResponse({
        type: 'error',
        message: 'An error occured while submitting the form'
      });
    }
  };
  return (
      <div id="contact-header" className="page">
      <ContactPage className="page-half" data-aos="fade-down">

        <div className='row input-container'>
          <div className='columns'>
            <div className='column' />
            <div className='col-xs-12'>
              <div
                className={
                  response.type === 'success'
                    ? 'tile box notification is-primary'
                    : 'is-hidden'
                }
              >
                <p>{response.message}</p>
              </div>
              <div
                className={
                  response.type === 'error'
                    ? 'tile box notification is-danger'
                    : 'is-hidden'
                }
              >
                <p>{response.message}</p>
              </div>
              <div
                className={response.message !== '' ? 'is-hidden' : 'columns'}
              >
                <div className='col-xs-12'>
                <h2>Get In Touch!</h2>
                  <p>We'd love to hear from you.</p>
                  <form
                    action='https://api.staticforms.xyz/submit'
                    method='post'
                    onSubmit={handleSubmit}
                  >
                    <div className='field'>
                      <div className='control'>
                        <input
                          className='input'
                          type='text'
                          placeholder='Name'
                          name='name'
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <br></br>
                    <div className='field'>
                      <div className='control'>
                        <input
                          className='input'
                          type='email'
                          placeholder='Email'
                          name='email'
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='field' style={{ display: 'none' }}>
                      <div className='styled-input wide'>
                        <input
                          type='text'
                          name='honeypot'
                          style={{ display: 'none' }}
                          onChange={handleChange}
                        />
                        <input
                          type='hidden'
                          name='subject'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='field'>
                      <div className='styled-input wide'>
                        <textarea
                          className='textarea'
                          style={{ resize: 'vertical' }}
                          placeholder='Your Message'
                          name='message'
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='field is-grouped'>
                      <div className='styled-input wide'>
                        <button className='btn-lrg submit-btn' type='submit'>
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <p> Made by ~us with Gatsby</p>
                    <p> Thanks to mkkellogg for the <a href='https://github.com/mkkellogg/GaussianSplats3D'>GaussianSplats3D library</a> for three.js</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xs-12' />
          </div>
        </div>
      </ContactPage>
    </div>
  );
}
