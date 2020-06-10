import React from "react";
import styled from "styled-components";
import {
  Navbar,
  Button,
  Dropdown,
  Container,
  NavbarBrand,
  Collapse,
  NavLink,
  InputGroup,
  InputGroupAppend,
  NavDropdown,
  Form,
  FormControl,
} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";

const Nav = ({}) => {
  return (
    <Navbar
      id="navbar-site"
      className="navbar bg-dark navbar-dark nav-pills navbar-expand-sm sticky-top"
    >
      <Container>
        <NavbarBrand className="d-none d-sm-inline-block">
          <img
            src="handshaking-stock-picture-2099029.jpg"
            className="col-3"
            alt=""
            style={{ width: " 100px" }}
          />
          Treatify
        </NavbarBrand>

        <Button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#myTogglerNav"
          aria-controls="myTogglerNav"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"> </span>
        </Button>
        <Collapse className="collapse navbar-collapse" id="myTogglerNav">
          <Navigator className="navbar-nav ml-sm-auto">
            <NavLink className="nav-link nav-item active" href="#home">
              Home
            </NavLink>
            <NavDropdown>
              <NavLink
                className="nav-link nav-item dropdown-toggle"
                data-toggle="dropdown"
                id="servicesDropdown"
                aria-haspopup="true"
                aria-expanded="false"
                href="#assets"
              >
                New treaty
              </NavLink>
              <DropdownMenu
                className="dropdown-menu"
                aria-labelledby="servicesDropdown"
              >
                <NavLink className="nav-link nav-item" href="#physical">
                  Volunteer
                </NavLink>
                <NavLink className="nav-link nav-item" href="#organisational">
                  Project to founder
                </NavLink>
                <NavLink className="nav-link nav-item" href="#brand">
                  Project to mentor
                </NavLink>
                <NavLink className="nav-link nav-item" href="#brand">
                  Project to service provider
                </NavLink>
              </DropdownMenu>
            </NavDropdown>
            <NavLink className="nav-link nav-item" href="#draft">
              Draft
            </NavLink>
            <NavLink className="nav-link nav-item" href="#active">
              Active
            </NavLink>
            <NavLink className="nav-link nav-item disabled" href="#withdrawn">
              Withdrawn
            </NavLink>
            <NavLink className="nav-link nav-item disabled" href="#settings">
              Settings
            </NavLink>
          </Navigator>
        </Collapse>
        <span
          className="navbar-text d-none d-xl-inline-block"
          style={{ padding: "20px", marginLeft: "20px", marginRight: "20px" }}
        >
          Onchain agreements
        </span>
        <Form className="form-inline">
          <InputGroup className="input-group">
            <FormControl
              className="form-control"
              type="text"
              placeholder="Search"
            />
            <InputGroupAppend>
              <Button className="btn-outline-light" type="submit">
                Go
              </Button>
            </InputGroupAppend>
          </InputGroup>
        </Form>
      </Container>
    </Navbar>
  );
};

// const Nav = ({ }) => {
//   return (
//   <Navbar bg="light" expand="lg">
//     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
//     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//     <Navbar.Collapse id="basic-navbar-nav">
//       <Nav className="mr-auto">
//         <Nav.Link href="#home">Home</Nav.Link>
//         <Nav.Link href="#link">Link</Nav.Link>
//         <NavDropdown title="Dropdown" id="basic-nav-dropdown">
//           <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
//           <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
//           <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
//           <NavDropdown.Divider />
//           <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
//         </NavDropdown>
//       </Nav>
//       <Form inline>
//         <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//         <Button variant="outline-success">Search</Button>
//       </Form>
//     </Navbar.Collapse>
//   </Navbar>
// );

export default Nav;
