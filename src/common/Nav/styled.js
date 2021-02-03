// components/Nav/styled.js
import styled from "styled-components";
import {Link} from "gatsby"

export const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: white;
  
`;
export const NavList = styled.ul`
  list-style: none;
`;
export const NavListItem = styled.li`
  float: right;
`;

export const NavListLink = styled(Link)`
  color: black;
  text-decoration: none;
  text-align: center;
  padding: 15px;

  :hover {
    color: white;
    background-color: black;
    }
    
    /* Small screens */
  @media all and (max-width: 500px) {
    padding: 3px;
    font-size: 12px;
  }
`;
