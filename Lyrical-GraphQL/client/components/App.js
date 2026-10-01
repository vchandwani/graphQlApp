import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%" }}>
      <CssBaseline enableColorScheme />
      <div className="container">
        {/* <Outlet /> renders the active child route (e.g., SongList) */}
        <Outlet />
      </div>
    </Box>
  );
};

export default App;
