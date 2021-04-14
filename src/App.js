import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BlogPage from "./blogPage";
import LoginPage from "./loginPage";
import firebase from "./firebase";
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';

function App() {
  const [currentUser, setCurrentUser] = useState();
  firebase.auth().onAuthStateChanged((user) => setCurrentUser(user));

  return (
    <Router>
      <AppBar
        position="static"
        style={{backgroundColor: "#d7d7d7"}}
      >
        <Toolbar>
          <Typography variant="h4" style={{ color: "black", margin: "10px 0", flexGrow: "1" }}>BLOG APP</Typography>
          <Button to="/" component={Link}>
            Blog
          </Button>
          <Button to="/login" component={Link}>
            Login/Signup
          </Button>
          <Button
            style={{ marginRight: "0px" }}
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
          </Button>
        </Toolbar>
      </AppBar>

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
