import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

import{ Navbar, Nav, NavDropdown}  from "react-bootstrap";

class NavBar extends Component {

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    redirectAdmin(e) {
        e.preventDefault();
        this.props.history.push('/admin');
    }

    redirectChangePassword(e) {
        e.preventDefault();
        this.props.history.push('/changepassword');
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <Nav className="ml-auto">
                <Nav.Link href="/pickcontestants">Pick Contestants</Nav.Link>
                <NavDropdown alignRight title={Object.is(user.firstname, undefined) ? 'title' : user.firstname} id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={this.redirectChangePassword.bind(this)}>Change Password</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.onLogout.bind(this)}>Logout</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.redirectAdmin.bind(this)}>Admin</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        )

        const guestLinks = (
            <Nav className="ml-auto">
                <Nav.Link href="/register">Sign Up</Nav.Link>
                <Nav.Link href="/login">Sign In</Nav.Link>
            </Nav>
        )
        return(
            <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <Navbar.Brand>
                        <img src="/logo512.png" width="30" height="30" className="d-inline-block align-top"
                             alt="Rose" style={{marginRight: .5 + 'em'}}/>
                        Final Rose Fantasy
                    </Navbar.Brand>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/standings">Standings</Nav.Link>
                        <Nav.Link href="/contestantslist">Contestants</Nav.Link>
                        <Nav.Link href="/scoringrules">Scoring Rules</Nav.Link>
                        <Nav.Link href="/howto">How To</Nav.Link>
                    </Nav>
                    {isAuthenticated ? authLinks : guestLinks}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(NavBar));
