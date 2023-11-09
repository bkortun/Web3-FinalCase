import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./rentalABI.json";

function Lists() {
  const [properties, setProperties] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [hirers, setHirers] = useState([]);
  const [renters, setRenters] = useState([]);
  const [reports, setReports] = useState([]);
  const [suspendedHirers, setSuspendedHirers] = useState([]);
  const [suspendedRenters, setSuspendedRenters] = useState([]);

  function handleStatus(uint) {
    switch (uint) {
      case 0:
        return "Finished"
      case 1:
        return "PendingByRenter"
      case 2:
        return "PendingByHirer"
      case 3:
        return "Continues"
      default:
        break;
    }
  }

  function handleSenderType(uint) {
    switch (uint) {
      case 0:
        return "Renter"
      case 1:
        return "Hirer"
      default:
        break;
    }
  }

  function handlePropertyType(uint) {
    switch (uint) {
      case 0:
        return "Residential"
      case 1:
        return "Commercial"
      default:
        break;
    }
  }

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          // MetaMask izni isteyin
          await window.ethereum.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();

          const contract = new ethers.Contract(
            "0xe3cAF1175511FBFf54FB9eB6B8FBE3F956Fe1068",
            abi,
            signer
          );


          setProperties(await contract.getProperties());
          setAgreements(await contract.getAgreements());
          setHirers(await contract.getHirers());
          setRenters(await contract.getRenters());
          setReports(await contract.getReports());
          console.log(await contract.getReports())
          setSuspendedHirers(await contract.getSuspendedHirers());
          setSuspendedRenters(await contract.getSuspendedRenters());

        } catch (error) {
          console.error("Hesap alınamadı:", error);
        }
      } else {
        console.error("MetaMask tarayıcı uzantısı bulunamadı.");
      }
    }

    connectToMetaMask();
  }, []);

  return (
    <div>
      <div className="column">
        <h2>Agreements</h2>
        <table class="center" border={1}>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Property Name</th>
            <th>Property Owner</th>
            <th>Hirer Address</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
          {agreements.map((item) => (
            <tr>
              <td>{parseInt(item.id._hex,16)}</td>
              <td>{handleStatus(item.agreementStatus)}</td>
              <td>{item.property?.name}</td>
              <td>{item.property?.owner}</td>
              <td>{item.hirer}</td>
              <td>{new Date(item.startDate * 1000).toString()}</td>
              <td>{new Date(item.endDate * 1000).toString()}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="list">
      <div className="column">
        <h2>Properties</h2>
        <table class="center" border={1}>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Location</th>
            <th>Owner Address</th>
            <th>Property Type</th>
          </tr>
          {properties.map((item) => (
            <tr>
              <td>{parseInt(item.id._hex,16)}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.owner}</td>
              <td>{handlePropertyType(item.propertyType)}</td>
            </tr>
          ))}
        </table>
      </div>
      
      <div className="column">
        <h2>Hirers</h2>
        <table class="center" border={1}>
          <tr>
            <th>Address</th>
          </tr>
          {hirers.map((item) => (
            <tr>
              <td>{item}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="column">
        <h2>Renters</h2>
        <table class="center" border={1}>
          <tr>
            <th>Address</th>
          </tr>
          {renters.map((item) => (
            <tr>
              <td>{item}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="column">
        <h2>Reports</h2>
        <table class="center" border={1}>
          <tr>
            <th>Id</th>
            <th>AgreementId</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Create Date</th>
            <th>Sender Type</th>
          </tr>
          {reports.map((item) => (
            <tr>
              <td>{parseInt(item.id._hex,16)}</td>
              <td>{parseInt(item.agreement?.id._hex,16)}</td>
              <td>{item.subject}</td>
              <td>{item.message}</td>
              <td>{new Date(parseInt(item.createdDate._hex,16) * 1000).toString()}</td>
              <td>{handleSenderType(item.senderType)}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="column">
        <h2>Suspended Hirers</h2>
        <table class="center" border={1}>
        <tr>
            <th>Address</th>
          </tr>
          {suspendedHirers.map((item) => (
            <tr>
              <td>{item}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="column">
        <h2>Suspended Renters</h2>
        <table class="center" border={1}>
        <tr>
            <th>Address</th>
          </tr>
          {suspendedRenters.map((item) => (
            <tr>
              <td>{item}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
    </div>
    
  );
}

export default Lists;


