import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Popover,
  IconButton,
  Stack,
  Divider,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Engineering,
  Category,
  Info,
  Settings as SettingsIcon,
  Home,
  Logout
} from "@mui/icons-material/";

const SettingsPopover = () => {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const { isAuthenticated, handleLogout } = useAuth();

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(e.currentTarget);
  const handleClose = () => setOpen(null);

  const MENU_OPTIONS = [
    {
      label: "Manage Contractors",
      icon: Engineering,
      linkTo: "/contractors",
      onclick: undefined
    },
    {
      label: "Manage Services",
      icon: Category,
      linkTo: "/services",
      onclick: undefined
    },
    {
      label: "Logout",
      icon: Logout,
      linkTo: "",
      onclick: handleLogout
    }
  ];


  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleOpen}
        sx={{ ml: 28, color: theme => theme.palette.primary.main }}
      >
        <SettingsIcon />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Stack sx={{ p: 2 }}>
          <MenuItem onClick={handleClose} component={Link} to="/">
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </MenuItem>

          {isAuthenticated && (
            <>
              <Divider sx={{ borderStyle: "dashed" }} />
              {MENU_OPTIONS.map(option => (
                <MenuItem
                  key={option.label}
                  onClick={() => {
                    if (option.onclick) {
                      option.onclick();
                    }
                    handleClose();
                  }}
                  component={Link}
                  to={option.linkTo === "" ? "/login" : option.linkTo}
                >
                  <ListItemIcon>{<option.icon />}</ListItemIcon>
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </>
          )}


          <Divider sx={{ borderStyle: "dashed" }} />
          <MenuItem onClick={handleClose} component={Link} to="/about">
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="About" />
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
};

export default SettingsPopover;
