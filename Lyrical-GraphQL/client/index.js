import React from "react";
import { createRoot } from "react-dom/client";
import { NotificationProvider } from "./context/NotificationContext";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import SongList from "./components/SongList";
import SongCreate from "./components/SongCreate";
import App from "./components/App";
// 1. Swap createBrowserRouter for createHashRouter
import { createHashRouter, RouterProvider } from "react-router-dom";
import SongDetail from "./components/SongDetail";

const client = new ApolloClient({
  dataIdFromObject: (object) => object.id,
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.id,
  }),
  link: new HttpLink({ uri: "/graphql" }),
});

// 2. Use createHashRouter and relative child paths
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <SongList />,
      },
      {
        path: "song/new", // Note: Remove leading slash for child routes
        element: <SongCreate />,
      },
      {
        path: "song/:id", // Note: Remove leading slash for child routes
        element: <SongDetail />,
      },
    ],
  },
]);

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ApolloProvider>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<Root />);
