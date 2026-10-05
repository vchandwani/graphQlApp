import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Router, hashHistory, Route, IndexRoute } from "react-router";
import App from "./components/App";
import Home from "./components/Home";

const link = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.id,
  }),
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector("#root"));
