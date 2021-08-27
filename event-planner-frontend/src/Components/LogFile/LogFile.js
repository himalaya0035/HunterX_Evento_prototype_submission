import React, {useState, useEffect} from "react";
import "./LogFile.css";
import Transaction from "./Transaction";
import axios from "axios";
import PerDayTransaction from '../Charts/PerDayTransaction'
import PerPersonTransaction from '../Charts/PerPersonTransaction'
import RechartPieChart from "../Charts/RechartPieChart";


function LogFile() {
    const [info, setInfo] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [firstChart, setFirstChart] = useState(true);
    const [secondChart, setSecondChart] = useState(false);

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function fetchTransactions() {
            setLoader(true);
            const eventID = document.location.pathname.split("/")[3];
            try {
                const res = await axios.get(`/banking/event_transactions/${eventID}`);
                const res2 = await axios.get(`/banking/event_transactions/${eventID}/third_party`);
                let arr1 = res.data
                let arr2 = res2.data

                const arr3 = arr1.concat(arr2);

                for (var i = 0; i < arr3.length; ++i) {
                    for (var j = 0; j < arr3.length; ++j) {
                        var a = arr3[i].timestamp;
                        var b = arr3[j].timestamp;
                        if (a > b) {
                            var temp = arr3[i];
                            arr3[i] = arr3[j];
                            arr3[j] = temp;
                        }
                    }
                }
                setInfo(arr3)

                setLoader(false);
            } catch (e) {
                alert('failed to fetch transactions')
            }


        }

        fetchTransactions();
        return () => {
            source.cancel();
        };
    }, []);

    const showFirstChart = () => {
        setFirstChart(true);
        setSecondChart(false);
    }
    const showSecondChart = () => {
        setFirstChart(false);
        setSecondChart(true);
    }

    return (
        <div style={
            Loader
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }
                : {}
        }>
            {Loader ? (
                <img
                    src="/static/loaderWifi.gif"
                    style={{width: "80px", height: "80px"}}
                />
            ) : (<div className="logFile__data">
                <div className="eventInfo__budget">
                    <div className="chartContainer">
                        {firstChart ? <RechartPieChart/> : (

                            <div className="perPersonDetail">
                                <div className="eventInfo__budget__details">
                                    <p>Total Budget</p>
                                    <h3>$12000</h3>
                                    <br/>
                                    <p>Budget remaining</p>
                                    <h4>$4000</h4>
                                </div>
                                <PerPersonTransaction/>
                            </div>
                        )}
                    </div>
                    <div className="switchCharts">
                        <button className={firstChart ? "perDay active" : "perDay"} onClick={showFirstChart}><p>View Per
                            Day </p>
                            <img src="/static/perDay.svg" style={{width: "15px", height: "15px"}} alt=""/>
                        </button>
                        <button className={secondChart ? "perPerson active" : "perPerson"} onClick={showSecondChart}>
                            <p>View Per Person</p>
                            <img src="/static/perPerson.svg" style={{width: "23px", height: "23px"}} alt=""/>
                        </button>
                    </div>
                </div>
                <div className="participantsDetails">
                    <p>{info.length} Transactions</p>
                    {/* <p><i className="fa fa-user-plus"></i></p> */}
                </div>
                <div className="transactionLogsContainer">
                    {info.map((transaction) => (
                        <Transaction
                            key={transaction.id}
                            from={transaction.from_user}
                            amount={transaction.amount}
                            task={{'to_user': transaction.task_name, 'task': transaction.task}}
                            date={new Date(transaction.timestamp).toLocaleString()}
                            to={transaction.to_user}
                            fromAccount={transaction.from_account}
                            toAccount={transaction.to_account}
                        />
                    ))}
                </div>
            </div>)}
        </div>
    );
}

export default LogFile;
