import React from "react";
import styled from "styled-components";

const StyledNav = styled.nav(`

`);

const Nav = ({}) => {
  return (
    <StyledNav
      id="navbar-site"
      className="navbar bg-dark navbar-dark nav-pills navbar-expand-sm sticky-top"
    >
      <div className="container">
        <div className="navbar-brand d-none d-sm-inline-block">
          <img
            src="handshaking-stock-picture-2099029.jpg"
            className="col-3"
            alt=""
            style={{ width: " 100px" }}
          />
          Treatify
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#myTogglerNav"
          aria-controls="myTogglerNav"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="myTogglerNav">
          <div className="navbar-nav ml-sm-auto">
            <a className="nav-link nav-item active" href="#home">
              Home
            </a>
            <div className="dropdown">
              <a
                className="nav-link nav-item dropdown-toggle"
                data-toggle="dropdown"
                id="servicesDropdown"
                aria-haspopup="true"
                aria-expanded="false"
                href="#assets"
              >
                New treaty
              </a>
              <div className="dropdown-menu" aria-labelledby="servicesDropdown">
                <a className="nav-link nav-item" href="#physical">
                  Volunteer
                </a>
                <a className="nav-link nav-item" href="#organisational">
                  Project to founder
                </a>
                <a className="nav-link nav-item" href="#brand">
                  Project to mentor
                </a>
                <a className="nav-link nav-item" href="#brand">
                  Project to service provider
                </a>
              </div>
            </div>
            <a className="nav-link nav-item" href="#draft">
              Draft
            </a>
            <a className="nav-link nav-item" href="#active">
              Active
            </a>
            <a className="nav-link nav-item" href="#withdrawn">
              Withdrawn
            </a>
            <a className="nav-link nav-item" href="#settings">
              Settings
            </a>
          </div>
        </div>
        <span
          className="navbar-text d-none d-xl-inline-block"
          style={{ padding: "20px", marginLeft: "20px", marginRight: "20px" }}
        >
          Onchain agreements
        </span>
        <form className="form-inline">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Search" />
            <div className="input-group-append">
              <button className="btn btn-outline-light" type="submit">
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
    </StyledNav>
  );
};

export default Nav;
