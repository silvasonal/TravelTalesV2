// src/Layout.js
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate} from "react-router-dom";
import { BsHouseDoor, BsPersonCircle,BsPlusCircle,BsSearch } from "react-icons/bs";
import { Container, Form, FormControl, Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";


const Layout = ({token, handleLogout }) => {
    const [searchUsername, setSearchUsername] = useState('');
    const [searchCountry, setSearchCountry] = useState('');

    const navigate = useNavigate();

    const handleClick = () => {
        if (token) {
            handleLogout(); 
            window.location.pathname = "/login"; 
        } else {
            window.location.pathname = "/login"; 
        }
    };
    const handleSidebarSearch = () => {
        if (searchUsername || searchCountry) {
            // Navigate to /home with search parameters
            navigate(`/home?username=${searchUsername}&country=${searchCountry}`);
        }
    };

    const handleClearFilters = () => {
        setSearchUsername('');
        setSearchCountry('');
        navigate('/home'); 
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-dark text-white d-flex flex-column p-3" style={{ minHeight: "100vh", width: "200px" }}>
                    <h5 className="mb-4">TravelTales</h5>


                <Nav className="flex-column">

                    <NavLink as={NavLink}  to="/home" className="nav-item">
                        <BsHouseDoor className="nav-icon" />
                        Home
                    </NavLink>
                  
                    <NavLink as={NavLink}  to="/profile" className="nav-item">
                        <BsPersonCircle className="nav-icon" />
                        Profile
                    </NavLink>

                    <NavLink as={NavLink}  to="/create" className="nav-item">
                        <BsPlusCircle  className="nav-icon" />
                        Create
                    </NavLink>
  
                </Nav>

                {/* Sidebar Search */}
                <Form className="sidebar-search-form d-flex flex-column gap-2 mb-3">
                    <FormControl
                        type="text"
                        placeholder="Username"
                        size="sm"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        className="form-control-sm"
                    />
                    <FormControl
                        type="text"
                        placeholder="Country"
                        size="sm"
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="form-control-sm"
                    />
                    <Button
                        variant="outline-light"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                        onClick={handleSidebarSearch}
                    >
                        <BsSearch className="me-1" /> Search
                    </Button>
                    <Button
                        variant="outline-light"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </Form>

                <div className="profile-section">
                    <button
                        id="logout_btn"
                        className="btn btn-sm btn-outline-light mt-3"
                        onClick={handleClick}
                    >
                        {token ? "Logout" : "Login"}
                    </button>
                </div>

            </div>

            {/* Main Content */}
            <Container fluid className="p-4 bg-white flex-grow-1">
                <Outlet />
            </Container>
        </div>
    );
};

export default Layout;
