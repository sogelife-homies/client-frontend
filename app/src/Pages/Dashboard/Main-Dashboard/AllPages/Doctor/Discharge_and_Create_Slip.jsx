import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CreatePayment, CreateReport } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./CSS/form.css";
import { toast, ToastContainer } from "react-toastify";
import {ethers, AbstractProvider} from 'ethers';

import Web3 from 'web3';

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

  async function getWallet(companyAddress, kpiId, kpiValue) {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, contractAddress);
  
        // Get the account of the user
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          console.log("Please connect to MetaMask.");
        } else {
          const account = accounts[0]; // The first account is usually the user's primary account
          console.log("Account:", account);
  
          // Send the transaction
          const gasPrice = await web3.eth.getGasPrice(); // Get current gas price

await contract.methods.addPublicKPI('0xBd6ce1a1cDC207913BffE8C0d802B8e793240E42', kpiId, kpiValue)
  .send({
    from: '0xBd6ce1a1cDC207913BffE8C0d802B8e793240E42',
    gasPrice: gasPrice,
  });
  
          console.log("Transaction sent!");
          notify("Transaction completed successfully!");
        }
      } else {
        console.log("Please install MetaMask!");
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      notify('Error sending transaction.');
    }
  }

    const jsonRpcURL = 'https://node.ghostnet.etherlink.com/';
    const web3 = new Web3(jsonRpcURL);
  
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "commitment",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "proof",
            "type": "bytes"
          }
        ],
        "name": "addPrivateKPI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "addPublicKPI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          }
        ],
        "name": "getKPIKey",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          }
        ],
        "name": "getPrivateKPIStat",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          }
        ],
        "name": "getPublicKPI",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "kpiId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "vefifier",
            "type": "address"
          }
        ],
        "name": "setKPIVerfier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
    const contractAddress = '0xd6Ec7C42cC35B8419e398cFe29684baEAb0c2F9d';
    const contract = new web3.eth.Contract(abi, contractAddress);


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
                <label>KPI name</label>
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
              <button
                className="formsubmitbutton bookingbutton"
                onClick={(e) => {
                  e.preventDefault();
                  getWallet('0xBd6ce1a1cDC207913BffE8C0d802B8e793240E42', 1, 1000);
                }}
              >
                {loading ? "Loading..." : "Add KPI Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discharge_and_Create_Slip;