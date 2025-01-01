// src/components/Navbar.jsx
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Gunakan useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faShoppingBag, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Styled Components
const NavbarContainer = styled.nav`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: white;
    position: fixed;
    height: 4rem;
    bottom: 0;
    border-top:1px solid whitesmoke;
    z-index: 12;
`;

const NavbarLink = styled(NavLink)`
    text-decoration: none;
    color: gray;
    font-size: 2rem;

    &.active {
        color: black; /* Warna aktif */
    }

    &:hover {
        color: black;
    }
`;

// Main Component
function Navbar() {
    
    return (
        <NavbarContainer>
            <NavbarLink to="/" end>
                <FontAwesomeIcon icon={faHome} fontSize={26}/>
            </NavbarLink>
            <NavbarLink to="/product">
                <FontAwesomeIcon icon={faShoppingBag} fontSize={26}/>
            </NavbarLink>
            <NavbarLink to="/favorite">
                <FontAwesomeIcon icon={faHeart} fontSize={26}/>
            </NavbarLink>
            <NavbarLink to="/history">
                <FontAwesomeIcon icon={faHistory} fontSize={26}/>
            </NavbarLink>
            <NavbarLink to="/profile">
                <FontAwesomeIcon icon={faUser} fontSize={26}/>
            </NavbarLink>
        </NavbarContainer>
    );
}

export default Navbar;
