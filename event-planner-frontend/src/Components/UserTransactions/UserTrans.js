import React from "react";
import {
  Avatar,
  Fade,
  makeStyles,
  Modal,
  createTheme,
  Typography,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import UserTransLog from "./UserTransLog";

import "./UserTrans.css";

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
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 1),
    width: "30%",
    height: "75vh",
    borderRadius: "20px",
    [theme.breakpoints.down("lg")]: {
      width: "30%",
    },
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  moreVert: {
    marginLeft: "10px",
  },
  personIcon: {
    color: "#707070",
    marginLeft: "7px",
    height: "20px",
  },
  modalAvatar: {
    width: "70px",
    height: "70px",
    margin: "auto",
    marginBottom: "20px",
  },
}));

const UserTrans = ({ open, handleClose, from, img }) => {
  const classes = useStyles();

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
            {/* main code*/}
            <div className="userTrans">
              <div className="userTrans__details">
                <Avatar alt={from} src="" className={classes.modalAvatar} />
                <Typography variant="h6">
                  {from}'s transaction details
                </Typography>
                <div className="userTrans__expenses">
                  <div className="userTrans__totalExpense">
                    <h3>Total Expense</h3>
                    <p>$5000</p>
                  </div>
                  <div className="userTrans__receievedAmount">
                    <h3>Amount Received</h3>
                    <p>$7800</p>
                  </div>
                </div>
              </div>
              <div className="userTrans__logs">
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"paid"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"paid"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
                <UserTransLog
                  name={"shivansh gupta"}
                  status={"receieved"}
                  amount={2400}
                  time={"9/10/2021"}
                />
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default UserTrans;
