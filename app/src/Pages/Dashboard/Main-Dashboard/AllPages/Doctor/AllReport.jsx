import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllReports } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";

import "./CSS/AllReport.css";

const AllReport = () => {
  const dispatch = useDispatch();
  const [Report, setReport] = useState();
  useEffect(() => {
    dispatch(GetAllReports()).then((res) => {
      setReport(res);
    });
  }, []);
  return (
    <>
      <div className="container">
        <Sidebar />

        {/* ************************************ */}

        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 className="tag" >All Reports</h1>
            <div className="patientBox">
              <table>
                <thead>
                  <tr className="title">
                    <th>Asset Name</th>
                    <th>Value</th>
                    <th>Metric</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {Report?.map((ele) => {
                    return (
                      <tr>
                        <td>{ele.patientName}</td>
                        <td>{ele.docDepartment}</td>
                        <td>{ele.docName}</td>
                        <td>{ele.patientMobile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllReport;
