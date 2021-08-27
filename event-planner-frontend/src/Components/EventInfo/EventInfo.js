import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import "./EventInfo.css";
import EventInfoPerson from "./EventInfoPerson";
import InviteModal from "../InviteModal/InviteModal";
import TransferMoney from "../TransferMoney/TransferMoney";
import AddMoney from "../AddMoney/AddMoney";
import AddBank from '../AddBank/AddBank'

function EventInfo({ people, Loader }) {
  const [open, setOpen] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openBankAcc, setOpenBankAcc] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenTransfer = () => {
    setOpenTransfer(true);
  };

  const handleCloseTransfer = () => {
    setOpenTransfer(false);
  };
  const handleOpenBankAcc = () => {
    setOpenBankAcc(true);
  };

  const handleCloseBankAcc = () => {
    setOpenBankAcc(false);
  };


  return (
    <div
      style={
        Loader
          ? {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }
          : {}
      }
    >
      {Loader ? (
        <img
          src="/static/loaderWifi.gif"
          style={{ width: "80px", height: "80px" }}
        />
      ) : (
        <div className="eventInfo">
          <div className="eventInfo__budget">
            <div className="eventInfo__budget__main">
              <div className="eventInfo__budget__details">
                <p>Total Expense</p>
                <h3> ₹{people.total_expense} </h3>
                <br />
                <p>Estimated Expense</p>
                <h4> ₹{people.estimated_expense} </h4>
              </div>
              <div className="evenInfo__budget__circular">
                <CircularProgress
                  valueStart={people.estimated_expense}
                  valueEnd={people.total_expense}
                />
              </div>
            </div>
            <div className="eventInfo_budget_buttons">
              <button onClick={handleOpenBankAcc}>
                <p>Add Bank Acc</p>
              </button>
              {openTransfer && (
                <TransferMoney
                  open={openTransfer}
                  handleClose={handleCloseTransfer}
                />
              )}

              {openBankAcc && (
                <AddBank open={openBankAcc} handleClose={handleCloseBankAcc} />
              )}

              <button onClick={handleOpenTransfer}>
                <p>Transfer</p>
              </button>
            </div>
          </div>
          <div className="participantsDetails">
            <p>{people.participants_data.length} Participants</p>

            {open && <InviteModal open={open} handleClose={handleClose} />}

            <p>
              {people.is_host && (
                <i className="fa fa-user-plus" onClick={handleOpen}></i>
              )}
            </p>
          </div>
          <div className="eventInfo__people">
            {people.participants_data.map((person) => {
              return (
                <EventInfoPerson
                  key={person.id}
                  id={person.id}
                  name={person.full_name}
                  money={person.total_expenses}
                  isAdmin={person.is_host}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventInfo;
