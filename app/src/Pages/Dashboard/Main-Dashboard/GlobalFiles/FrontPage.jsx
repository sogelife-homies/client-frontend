// import { Table } from "antd";
import React, { useState, useEffect } from "react";
import { MdAttachMoney } from "react-icons/md";
import { MdChromeReaderMode } from "react-icons/md";
import { RiEmpathizeLine } from "react-icons/ri";
import { MdEmojiEmotions  } from "react-icons/md";
import Sidebar from "./Sidebar";
// import { useDispatch, useSelector } from "react-redux";
// import { GetAllData, GetPatients } from "../../../../Redux/Datas/action";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import doughnutChartData from "../../../../Components/Chart/doughnut";
import { Popup } from 'react-easy-popup';
import 'react-easy-popup/dist/react-easy-popup.min.css';
import Web3 from 'web3';
import {processKPI} from "../../../../Services/ChatGPT";
import {kpis} from "../../../../Services/Database";


const FrontPage = () => {
  // const columns = [
  //   { title: "Asset", dataIndex: "patientName", key: "patientName" },
  //   { title: "Company", dataIndex: "age", key: "age" },
  //   { title: "Value", dataIndex: "bloodGroup", key: "bloodGroup" },
  //   { title: "Metric", dataIndex: "email", key: "email",       
  //   render: (text, record) => (
  //     <>
  //       {/* <span>{record.bloodGroup}</span> Display the blood group */}
  //       {record.age} <button className="pop-up-button" onClick={() => handleMetricClick(record)}>?</button>
  //     </>
  //   ), },
  // ];

  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleMetricClick = (record) => {
    (async ()=>{
      console.debug("kpis >>", kpis)

      const processedKPI =await processKPI(kpis)
      setSelectedRecord(JSON.parse(processedKPI));
      setVisible(true);
    })()
  };

  // const { patients } = useSelector((store) => store.data.patients);
  // const {
  //   dashboard: { data },
  // } = useSelector((store) => store.data);

  // console.log(data);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(GetPatients());
  //   dispatch(GetAllData());
  // }, []);

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
  
  const contract = new web3.eth.Contract(abi, contractAddress)

  const [contractData, setContractData] = useState('');

  const readFromSmartContract = async () => {
    const test = await contract.methods.getPublicKPI('0xE46DB4484E7eF0177Cc5e672d554DeDcEC0Bee3b', 1).call();
    console.log("this is a test: ", test);
    setContractData(test.toString()); // Store the result in state
  };

  useEffect(() => {
    readFromSmartContract();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <h1 style={{ color: "rgba(204, 12, 123, 1)" }}>Portfolio Overview</h1>
        <div className="contentWrapper">
        <div className="maindiv">
          <div className="one commondiv">
            <div>
              <h1>27</h1>
              <p>Net Value</p>
            </div>
            <MdAttachMoney className="overviewIcon" />
          </div>
          <div className="two commondiv">
            {" "}
            <div>
              <h1>27</h1>
              <p>Assets</p>
            </div>
            <MdChromeReaderMode className="overviewIcon" />
          </div>
          <div className="three commondiv">
            <div>
              <h1>27</h1>
              <p>Health</p>
            </div>
            <RiEmpathizeLine className="overviewIcon" />
          </div>
          <div className="six commondiv">
            {" "}
            <div>
              <h1>27</h1>
              <p>Global feeling</p>
            </div>
            <MdEmojiEmotions  className="overviewIcon" />
          </div>
        </div>
        <div className="rightSide">
        <Doughnut className="doughnut" data={doughnutChartData} />
          
      </div>
      </div>
        <div className="patientDetails">
          <h1>Assets Details</h1>
          <div className="patientBox">
            

           <div className="patientBox">

          <table>
          <thead>
                  <tr className="patientBox">
                    <th>Asset Name</th>
                    <th>Value</th>
                    <th>Metric</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>fake name</td>
                        <td>1</td>
                        <td>1</td>
                        <td><button className="pop-up-button" onClick={() => handleMetricClick()}>?</button></td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td><button className="pop-up-button" onClick={() => handleMetricClick()}>?</button></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td><button className="pop-up-button" onClick={() => handleMetricClick()}>?</button></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>3</td>
                        <td>3</td>
                        <td><button className="pop-up-button" onClick={() => handleMetricClick()}>?</button></td>
                      </tr>
                </tbody>
              </table>

          </div>
        </div>
        <Popup className="pop-up-container"maskClosable visible={visible} onClose={() => setVisible(false)} rowClassName={() => 'custom-row'}>
        <div className="pop-up">
          {selectedRecord ? (
            <>
              <h2 className="pop-up-title">Metric details</h2>
              <div className="pop-up-container-info">
              <p className="pop-up-score">{selectedRecord?.score} ->{selectedRecord?.emoji} </p>
              <p className="pop-up-sumup"> {selectedRecord?.summary}</p>
              <div className="pop-up-kpi" >
              <p> KPI X: {contractData}</p>
              <p> KPI 1: {contractData}</p>
              </div>
              </div>
            </>
          ) : (
            <p>No data available</p>
          )}
          <button className="pop-up-close" onClick={() => setVisible(false)}>Close</button>
        </div>
      </Popup>
      </div>
    </div>
    </div>
  );
};

export default FrontPage;
