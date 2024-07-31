// components/Nav/index.js
import React from 'react'

// import { NavWrapper, NavList, NavListItem, NavListLink } from './styled.js'

// components/Nav/styled.js
import styled from "styled-components";
import {Link} from "gatsby"

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: white;
  
`;
const NavList = styled.ul`
  list-style: none;
`;
const NavListItem = styled.li`
  float: right;
`;

const NavListLink = styled(Link)`
  color: black;
  text-decoration: none;
  text-align: center;
  padding: 15px;
  font-size: 15px;

  &:hover {
    color: white;
    background-color: black;
  }
    
    /* Small screens */
  @media all and (max-width: 500px) {
    padding: 3px;
    font-size: 12px;
  }
`;


const Nav = () => (
  <NavWrapper>
    <NavList>
        <NavListLink to="/">~ TILDE VISUAL</NavListLink>

      <NavListItem>
        <NavListLink to="/#contact-header">
          CONTACT
        </NavListLink>
      </NavListItem>
      <NavListItem>
        <NavListLink to="/#about-header">
          ABOUT US
        </NavListLink>
      </NavListItem>
      <NavListItem>
        <NavListLink to="/#work-header">
          WORK
        </NavListLink>
      </NavListItem>
    </NavList>
  </NavWrapper>
)

export default Nav