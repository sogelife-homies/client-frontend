import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CreatePayment, CreateReport } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./CSS/form.css";
import { toast, ToastContainer } from "react-toastify";
import {ethers} from 'ethers';
import MetaMask from '../../../../../Components/Wallet/MetaMask';
const notify = (text) => toast(text);

const Discharge_and_Create_Slip = () => {
  const { data } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const initmed = {
    medName: "",
    dosage: "",
    duration: "",
  };
  const [med, setmed] = useState(initmed);

  const [medicines, setmedicines] = useState([]);

  const HandleMedChange = (e) => {
    setmed({ ...med, [e.target.name]: e.target.value });
  };

  const InitData = {
    KPIname: "",
    company: "",
    industry: "",
    value: "",
    metric: "",
  };

  const [ReportValue, setReportValue] = useState(InitData);

  const HandleReportChange = (e) => {
    setReportValue({ ...ReportValue, [e.target.name]: e.target.value });
  };

  const HandleMedAdd = (e) => {
    e.preventDefault();
    setmedicines([...medicines, med]);
    setmed(initmed);
  };

  function getWallet(e) {
    e.preventDefault();
    console.log('clicked')
      if (window.ethereum) {
        console.log("Metamask installed on broswer")

        window.ethereum.request({method: 'eth_requestAccounts'}).then(res => {
          console.log(res)
        })


      } else {
        console.log("Install Metamask Extension")
      }
  }

  const HandleReportSubmit = (e) => {
    e.preventDefault();
    let data = {
      ...ReportValue,
      medicines,
    };
    try {
      setLoading(true);
      dispatch(CreateReport(data)).then((res) => {
        if (res.message === "KPI Report successfully created") {
          notify("KPI Report Created Sucessfully");
          setLoading(false);
          setReportValue(InitData);
        } else {
          setLoading(false);
          notify("Something went Wrong");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }
  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_div">
            <h1>Create Report</h1>
            <form>
              <div>
                <label>KPI-name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Name"
                    name="docName"
                    value={ReportValue.docName}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>company</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="company name"
                    name="docDepartment"
                    value={ReportValue.docDepartment}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>industry</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder=""
                    name="docMobile"
                    value={ReportValue.docMobile}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label> value</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Name"
                    name="number"
                    value={ReportValue.patientName}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label> metric </label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="number"
                    name="patientAge"
                    value={ReportValue.patientAge}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
            <div>
              <button
                className="formsubmitbutton bookingbutton"
                onClick={HandleReportSubmit}
              >
                {loading ? "Loading..." : "Add KPI Report"}
              </button>
              <button className="formsubmitbutton bookingbutton" onClick={getWallet}>
          Connect Wallet
        </button>
        </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discharge_and_Create_Slip;