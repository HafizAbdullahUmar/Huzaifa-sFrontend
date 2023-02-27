import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";

function NavbarComponent() {
  const [show, setShow] = useState(false);
  const [id, setId] = useState({
    email: "",
    password: "",
  });
  const secretEmail = "1234";
  const secretPassword = "1234";
  const { isLoggedIn, setIsLoggedIn } = useWarehouseStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    setIsLoggedIn: state.setIsLoggedIn,
  }));

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onChange = (e) => {
    setId({ ...id, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.email === secretEmail && id.password === secretPassword) {
      setIsLoggedIn(true);
      setShow(false);
      setId({
        email: "",
        password: "",
      });
    } else {
      toast.error("Wrong Credentials", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="p-2"
    >
      <Container fluid>
        <Navbar.Brand>Huzaifa's Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/warehouse">
              <Nav.Link>Warehouse</Nav.Link>
            </LinkContainer>
            <LinkContainer to={"/sale"}>
              <Nav.Link>Sales</Nav.Link>
            </LinkContainer>
            {isLoggedIn ? (
              <LinkContainer to={"/owner"}>
                <Nav.Link>Owner</Nav.Link>
              </LinkContainer>
            ) : (
              ""
            )}
          </Nav>
          <Nav>
            {!isLoggedIn ? (
              <>
                <Button variant="primary" onClick={handleShow}>
                  Login
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Log In</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {" "}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={id.email}
                          onChange={onChange}
                          placeholder="Enter email"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={id.password}
                          onChange={onChange}
                          placeholder="Password"
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setId({
                    email: "",
                    password: "",
                  });
                  setIsLoggedIn(false);
                }}
              >
                LogOut
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
