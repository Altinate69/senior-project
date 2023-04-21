import React, { useState } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Col md={4}>
        <Card>
          <Card.Header as="h5">Login</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="py-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="py-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-start align-items-center">
                <Button variant="primary" type="submit" className="d-flex my-2">
                  Login
                </Button>
                <Link
                  to="/signup"
                  className="d-flex justify-content-center align-items-center signup-text ps-2"
                >
                  Sign up
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
