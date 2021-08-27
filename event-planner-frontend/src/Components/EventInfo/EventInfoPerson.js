import {Avatar, IconButton, makeStyles} from "@material-ui/core";
import React, {useEffect} from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PersonIcon from "@material-ui/icons/Person";

import "./EventInfoPerson.css";
import ManageParticipantMenu from "../ManageParticipantMenu/ManageParticipantMenu";
import UserTrans from '../UserTransactions/UserTrans'

const useStyles = makeStyles({
    moreVert: {
        marginLeft: "10px",
    },
    personIcon: {
        color: "#707070",
        marginLeft: "7px",
        height: "20px",
    },
});

function EventInfoPerson({name, money, isAdmin}) {
    const classes = useStyles();

    const [showPopUp, setShowPopUp] = React.useState(false);
    let menuRef = React.useRef();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleButtonClick = () => {
        setShowPopUp(!showPopUp);
    }

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowPopUp(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
        }
    }, [])

    return (
        <div className="eventInfo__person">
            <div className="eventInfo__person__details" style={{cursor:"pointer"}} onClick = {handleOpen} >
                <Avatar alt={name} src="/static/images/img1.png"/>
                <p>{name}</p>
                {isAdmin && <PersonIcon className={classes.personIcon}/>}
            </div>
            {open && <UserTrans open={open} handleClose={handleClose} from={name} />}
            <div className="eventInfo__person__money">
                <p>₹{money}</p>
                <div ref={menuRef} style={{position: 'relative'}}>
                    <IconButton onClick = {handleButtonClick} className={classes.moreVert}>
                        <MoreVertIcon/>
                    </IconButton>
                    <ManageParticipantMenu showPopUp={showPopUp} setShowPopUp={setShowPopUp}/>
                </div>
            </div>
        </div>
    );
}

export default EventInfoPerson;
