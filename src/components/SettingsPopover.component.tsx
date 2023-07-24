import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Settings as SettingsIcon
} from "@mui/icons-material/";

const MENU_OPTIONS = [
  {
    label: "Manage Contractors",
    icon: Engineering,
    linkTo: "/contractors"
  },
  {
    label: "Manage Services",
    icon: Category,
    linkTo: "/services"
  }
];

const SettingsPopover = () => {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(e.currentTarget);
  const handleClose = () => setOpen(null);

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleOpen}
        sx={{ ml: 28 }}
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
          <MenuItem onClick={handleClose} component={Link} to="/about">
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="About" />
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack sx={{ p: 2 }}>
          {MENU_OPTIONS.map(option => (
            <MenuItem
              key={option.label}
              onClick={handleClose}
              component={Link}
              to={option.linkTo}
            >
              <ListItemIcon>{<option.icon />}</ListItemIcon>
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default SettingsPopover;
