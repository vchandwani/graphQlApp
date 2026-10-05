import React from "react";
import { Link } from "react-router";
import AdbIcon from "@material-ui/icons/Adb";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { CURRENT_USER_QUERY } from "../queries/currentUser";
import { useQuery, useMutation } from "@apollo/client/react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import LOGOUT_MUTATION from "../mutations/Logout";

const settings = ["Profile"];
const pages = ["Products"];

const Header = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATION, {
    update(cache) {
      cache.writeQuery({ query: CURRENT_USER_QUERY, data: { user: null } });
    },
  });
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogoutClick = () => {
    handleCloseUserMenu();
    logout()
      .then(() => {
        console.log("Logout successful");
      })
      .catch((err) => {
        console.error("Logout failed", err);
      });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link to="/">Header</Link>
          </Typography>

          {data && data.user && data.user.id ? (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
                  {page}
                </Button>
              ))}
            </Box>
          ) : null}
          {data && data.user && data.user.id ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography sx={{ textAlign: "center" }}>Welcome, {data && data.user && data.user.email}</Typography>
                </MenuItem>
                {settings
                  .filter((setting) => setting !== "Profile")
                  .map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                <MenuItem onClick={onLogoutClick}>
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
          {!(data && data.user && data.user.id) ? (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
