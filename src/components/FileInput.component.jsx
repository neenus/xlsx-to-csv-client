import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: "none"
  }
}));
const FileInput = ({ value, onChange, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input type="file" name="file" className={classes.input} />
      <label htmlFor="file">
        <Button color="primary" variant="contained" component="span">
          Upload
        </Button>
        <span>{value}</span>
      </label>
    </div>
  );
};

export default FileInput;
