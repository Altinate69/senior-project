import { useState } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import { Link, redirect } from "react-router-dom";
import "./style.css";
import axios from "axios";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`username: ${username}, password: ${password}`);

    console.log(JSON.stringify({ username, password }));

    axios
      .post(
        "http://localhost:3333/login",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log(res.data);
        alert("Pass new User =" + res.data);
        redirect("/");
      })
      .catch((error) => {
        alert("There was an error!" + error);
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="background">
      <Col md={4}>
        <Card>
          <Card.Header as="h3" className="logincard-header">
            Login
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="py-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
