import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import firebase from "./firebase";
import Spinner from "./Spinner";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import rootReducer from "./reducers";
import { setUser } from "./actions";

const store = createStore(rootReducer, composeWithDevTools());

const Root = props => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.setUser(user);
        props.history.push("/");
      }
    });
  }, []);

  return props.isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
