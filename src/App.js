import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 50,
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,
    overflowWrap: "break-word",
  },
  table: {
    minWidth: 650,
  },
}));

const axios = require("axios");

export default function QueryParamsExample() {
  return (
    <Router>
      <QueryParamsDemo />
    </Router>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function QueryParamsDemo() {
  let query = useQuery();

  return (
    <div>
      <div>
        <h2>Accounts</h2>
        <Link to="/login"></Link>

        <Child code={query.get("code")} />
      </div>
    </div>
  );
}

const config = {
  headers: {
    Authorization:
      "Basic " +
      btoa(
        process.env.REACT_APP_OAUTH_CLIENT_ID +
          ":" +
          process.env.REACT_APP_OAUTH_CLIENT_SECRET
      ),
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

function Child(props) {
  const classes = useStyles();
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.REACT_APP_OAUTH_CLIENT_ID);
    params.append("code", props.code);
    params.append("redirect_uri", process.env.REACT_APP_LOGIN_URL);
    const url = process.env.REACT_APP_OAUTH_URL + "/oauth2/token";

    axios
      .post(url, params, config)
      .then((result) => {
        setToken(result.data.id_token);
        localStorage.setItem("token", result.data.id_token);
        setUserData(jwt_decode(result.data.id_token));
        console.log(jwt_decode(result.data.id_token));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const clearCookie = () => {
    localStorage.setItem("token", "");
  };

  return (
    <div className={classes.root}>
      {props.code ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearCookie}
              href={
                process.env.REACT_APP_OAUTH_URL +
                "/logout?client_id=" +
                process.env.REACT_APP_OAUTH_CLIENT_ID +
                "&logout_uri=" +
                process.env.REACT_APP_LOGIN_URL
              }
            >
              Logout
            </Button>
          </Grid>

          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <code>code</code>
              <hr />
              {props.code}
            </Paper>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <code>JWT</code>
              <hr />
              {token}
            </Paper>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Key</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(userData).map((k) => {
                    return (
                      <TableRow key={k}>
                        <TableCell align="right">{k}</TableCell>
                        <TableCell align="right">
                          {String(userData[k])}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              href={
                process.env.REACT_APP_OAUTH_URL +
                "/login?response_type=code&client_id=" +
                process.env.REACT_APP_OAUTH_CLIENT_ID +
                "&redirect_uri=" +
                process.env.REACT_APP_LOGIN_URL
              }
            >
              Login
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
