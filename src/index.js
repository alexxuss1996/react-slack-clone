import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import firebase from "./firebase";

const Root = props => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.history.push("/");
      }
    });
  }, []);
  
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <Router>
    <RootWithAuth />
  </Router>,
  document.getElementById("root")
);
