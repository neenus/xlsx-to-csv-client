import { AppBar, Box, Toolbar } from "@mui/material";

import SettingsPopover from "./SettingsPopover.component";

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1, mb: theme => theme.spacing(2) }}>
      <AppBar
        position="static"
        color="transparent"
        enableColorOnDark
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center"
          }}
        >
          <SettingsPopover />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
