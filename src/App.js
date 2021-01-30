import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
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
  const [token, setToken] = useState("");

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
        console.log(result.data.id_token);
        setToken(result.data.id_token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {props.code ? (
        <>
          <h3>
            The <code>code</code> is &quot;{props.code}
            &quot;
          </h3>
          <h3>
            The <code>token</code> is &quot;{token}
            &quot;
          </h3>
          <a
            href={
              process.env.REACT_APP_OAUTH_URL +
              "/logout?client_id=" +
              process.env.REACT_APP_OAUTH_CLIENT_ID +
              "&logout_uri=" +
              process.env.REACT_APP_LOGIN_URL
            }
          >
            logout
          </a>
        </>
      ) : (
        <>
          <a
            href={
              process.env.REACT_APP_OAUTH_URL +
              "/login?response_type=code&client_id=" +
              process.env.REACT_APP_OAUTH_CLIENT_ID +
              "&redirect_uri=" +
              process.env.REACT_APP_LOGIN_URL
            }
          >
            you must login
          </a>
        </>
      )}
    </div>
  );
}
