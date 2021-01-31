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
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 50,
  },
  paper: {
    padding: 20,
    textAlign: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    overflowWrap: "break-word",
  },
  paperLeftAlign: {
    padding: 50,
    textAlign: "left",
    color: theme.palette.text.primary,
    overflowWrap: "break-word",
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: 5,
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function App() {
  return (
    <Router>
      <LoginApp />
    </Router>
  );
}

function LoginApp() {
  const classes = useStyles();
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [userData, setUserData] = useState("");
  let query = useQuery();

  useEffect(() => {
    setCode(query.get("code"));
    var cookieToken = localStorage.getItem("token");
    console.log(cookieToken)
    if (cookieToken != null && cookieToken != "") {
      console.log(cookieToken)
      setToken(cookieToken);
      setUserData(jwt_decode(cookieToken));
    } else {
      getToken();
    }
  }, []);

  const clearCookie = () => {
    localStorage.setItem("token", "");
  };

  const getToken = () => {
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
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.REACT_APP_OAUTH_CLIENT_ID);
    params.append("code", query.get("code"));
    params.append("redirect_uri", process.env.REACT_APP_LOGIN_URL);
    const url = process.env.REACT_APP_OAUTH_URL + "/oauth2/token";

    axios
      .post(url, params, config)
      .then((result) => {
        setToken(result.data.id_token);
        localStorage.setItem("token", result.data.id_token);
        setUserData(jwt_decode(result.data.id_token));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Paper className={classes.paperLeftAlign}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
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
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
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
          </Paper>
        </Grid>
        <Grid item xs={3}></Grid>
        {
          <>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              {/* <Paper className={classes.paper}>
                <code>Authorization Code for AWS Cognito</code>
                <hr />
                {code}
                <br />
                <br />
                <code>JWT from AWS Cognito</code>
                <hr />
                {token}
              </Paper> */}
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              User Data from JWT claims:
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Key</TableCell>
                      <TableCell align="left">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(userData).map((k) => {
                      return (
                        <TableRow key={k}>
                          <TableCell align="left">{k}</TableCell>
                          <TableCell align="left">
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
          </>
        }
      </Grid>
    </div>
  );
}
