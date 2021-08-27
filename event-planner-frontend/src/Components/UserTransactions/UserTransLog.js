import { Avatar } from "@material-ui/core";
import React from "react";

import "./UserTransLog.css";

const UserTransLog = ({ status, name, time, img, amount }) => {
  return (
    <div className="userTransLog">
      <div className="userTransLog__left">
        <Avatar alt={name} src="" />
        <div className="userTransLog__left__details">
          {status === "receieved" ? (
            <p>
              <b>Received from</b>
            </p>
          ) : (
            <p>
              <b>Payed to</b>
            </p>
          )}
          <p className="userTransLog__left__amount">${amount}</p>
        </div>
      </div>
      <div className="userTransLog__right">
        <p className="userTransLog__right__name">{name}</p>
        <p className="userTransLog__right__time">{time}</p>
      </div>
    </div>
  );
};

export default UserTransLog;
