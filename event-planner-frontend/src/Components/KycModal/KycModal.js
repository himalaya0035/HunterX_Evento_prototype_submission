import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {Button, Checkbox, TextField} from "@material-ui/core";
import csrftoken from "../../csrftoken";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: "20px",
        // width: "30%",
        [theme.breakpoints.down("lg")]: {
            width: "30%",
        },
        [theme.breakpoints.down("md")]: {
            width: "50%",
        },
        [theme.breakpoints.down("xs")]: {
            width: "95%",
            padding: "20px",
            // height: "70vh",
        },
    },
    heading: {
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "1.5rem",
    },
    input: {
        marginBottom: "20px",
    },
    btn: {
        width: "100%",
        marginBottom: "10px",
    },
    checkbox: {
        float: "left",
    },
}));

const KycModal = ({open, handleClose}) => {
    const classes = useStyles();

    const [panNumber, setPanNumber] = useState("");
    const [checked, setChecked] = useState(false);
    const [dob, setDOB] = useState()
    const [isDisabled, setIsDisabled] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    async function handleClick(e) {
        e.preventDefault()
        const data = {
            pancard_number: panNumber,
            dob: dob
        }
        const url = "/banking/complete_kyc"

        const config = {
            headers: {
                'X-CSRFToken': csrftoken
            },
        };
        setIsDisabled(true)
        await axios.post(url, data, config)
        setIsDisabled(false)
        handleClose()
    }

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
                        <h3 className={classes.heading}>Minimal KYC</h3>
                        <form>
                            <TextField
                                name="panNumber"
                                type="text"
                                xs={6}
                                onChange={(e) => setPanNumber(e.target.value)}
                                value={panNumber}
                                label="Enter your PAN Number"
                                variant="outlined"
                                fullWidth
                                required
                                className={classes.input}
                            />
                            <TextField
                                name="dob"
                                type="text"
                                placeholder="Date of Birth"
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.type = "text")}
                                xs={6}
                                value={dob}
                                onChange={e => (setDOB(e.target.value))}
                                variant="outlined"
                                fullWidth
                                required
                                className={classes.input}
                            />
                            <div
                                className="kyc__checkbox"
                                style={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    color="primary"
                                    inputProps={{"aria-label": "primary checkbox"}}
                                    className={classes.checkbox}
                                    required
                                />

                                <p style={{color: "gray"}}>
                                    I hereby declare that the details furnished above are true and
                                    correct to the best of my knowledge and beliefn case any of
                                    the above information is found to be false or untrue or
                                    misleading or misrepresenting, I am aware that I may be held
                                    liable for it.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                fullwidth
                                variant="outlined"
                                color="primary"
                                className={classes.btn}
                                onClick={handleClick}
                                style={isDisabled ? {pointerEvents: "none", color: "gray"} : {}}
                            >
                                {isDisabled && <i className="fa fa-spinner fa-spin" style={{marginRight:"5px"}}></i>}
                                Verify
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default KycModal;
