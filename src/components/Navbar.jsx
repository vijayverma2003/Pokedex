import React from "react";
import logo from "../media/logo.svg";
import menu from "../media/menu.svg";
import { Link } from "react-router-dom";

function Navbar(props) {
  return (
    <nav>
      <Link to="/">
        <img src={logo} className="nav--logo" />
      </Link>
      <button className="menu--button">
        <img src={menu} alt="" />
      </button>
    </nav>
  );
}

export default Navbar;
