import React, { useState } from "react";
import {
  Avatar,
  Button,
  createTheme,
  Fade,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";

import { banks } from "../banks";
import { Link } from "react-router-dom";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 550,
      md: 750,
      lg: 1280,
      xl: 1920,
    },
  },
});

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "auto",
    borderRadius: "20px",
    [theme.breakpoints.down("lg")]: {
      width: "35%",
    },
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  formControl: {
    minWidth: 120,
    width: "100%",
    textAlign: "left",
    margin: "10px auto 0px auto",
  },
  bankAdd__input: {
    marginTop: "20px",
  },
  btn: {
    width: "100%",
    border: "1px solid blue",
    marginTop: "30px",
  },
  bankAdd__name: {
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
}));

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddBank = ({ open, handleClose }) => {
  const classes = useStyles();

  const [bankName, setBankName] = React.useState([]);

  const handleBank = (event) => {
    setBankName(event.target.value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {/* {/ main code /}
            {/ choose bank acc /} */}
            <Typography variant="h4" className={classes.heading}>
              Add Bank Acc
            </Typography>
            <form>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-name-label">
                  Choose Bank
                </InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value={bankName}
                  onChange={handleBank}
                  input={<Input />}
                  required
                  MenuProps={MenuProps}
                >
                  {banks.map((name) => (
                    <MenuItem
                      key={name.bankName}
                      value={name.bankName}
                      // style={getStyles(name.bankName, bankName, theme)}
                    >
                      <div
                        className="bankAdd__select"
                        style={{ width: "100%" }}
                      >
                        <div className={classes.bankAdd__name}>
                          <p>{name.bankName}</p>
                        </div>
                        <div className="transfer__bankLogo">
                          <Avatar src={name.imgUrl} alt={name.bankName} />
                        </div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                xs={6}
                type="number"
                name="accNo"
                fullWidth
                label="Acc No."
                className={classes.bankAdd__input}
                required
              />
              <TextField
                xs={6}
                type="number"
                name="ifsc"
                fullWidth
                label="IFSC Code"
                className={classes.bankAdd__input}
                required
              />

              <TextField
                xs={6}
                type="text"
                name="upi"
                fullWidth
                label="Upi ID"
                className={classes.bankAdd__input}
              />

              <Button color="primary" className={classes.btn} type="submit">
                Add Account
              </Button>
            </form>
            <div className="addMoney__note">
                <p style={{marginTop:"10px"}}>
                  <b style={{ color: "black" }}>Note: </b>You can always manage all your Bank Accounts in <Link to="/profile" style={{textDecoration:"none"}}>Profile</Link> Page
                </p>
              </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AddBank;
