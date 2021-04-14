import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BlogPage from "./blogPage";
import LoginPage from "./loginPage";
import firebase from "./firebase";

function App() {
  const [currentUser, setCurrentUser] = useState();
  firebase.auth().onAuthStateChanged((user) => setCurrentUser(user));

  return (
    <Router>
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#d7d7d7",
          textAlign: "center",
        }}
      >
        <h1>Blog App</h1>
        <Link to="/login" style={{ float: "right" }}>
          Login/Signup
        </Link>
        <Link to="/" style={{ float: "right" }}>
          Blog
        </Link>
        <a
          href="/"
          style={{ float: "right" }}
          onClick={() =>
            firebase
              .auth()
              .signOut()
              .then(() => {
                console.log("Sign-out successful");
              })
              .catch((error) => {
                console.log("Unable to sign out");
              })
          }
        >
          Sign Out
        </a>
      </div>

      <Switch>
        <Route path="/login" exact>
          <LoginPage auth={currentUser} />
        </Route>
        <Route path="/" exact>
          <BlogPage auth={currentUser} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
