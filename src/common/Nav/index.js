// components/Nav/index.js
import React from 'react'

import { NavWrapper, NavList, NavListItem, NavListLink } from './styled'

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
        <NavListLink to="/#work-header">
          WORK
        </NavListLink>
      </NavListItem>
      <NavListItem>
        <NavListLink to="/#about-header">
          ABOUT US
        </NavListLink>
      </NavListItem>
    </NavList>
  </NavWrapper>
)

export default Nav