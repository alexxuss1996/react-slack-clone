import React, { Component } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : "";
  };

  displayErrors = errors => errors.map((error, index) => <p key={Math.random(index)}>{error.message}</p>);

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(error => {
          console.error(error);
          this.setState({ errors: this.state.errors.concat(error), loading: false });
        });
    }
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="yellow" textAlign="center">
            <Icon name="code branch" size="big" color="yellow" />
            Login to DEVChat
          </Header>
          <Form size="large" inverted onSubmit={this.handleSubmit}>
            <Segment stacked inverted>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                className={this.handleInputError(errors, "email")}
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                className={this.handleInputError(errors, "password")}
                type="password"
              />
              <Button disabled={loading} className={loading ? "loading" : ""} color="yellow" fluid size="large">
                Sign In
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message color="yellow">
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
