import logo from "./logo.svg";
import "./App.css";
import Page from "./Page";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./rentalABI.json";
import Lists from "./Lists";

function App() {
  const [properties, setProperties] = useState([]);
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          // MetaMask izni isteyin
          await window.ethereum.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();

          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const selectedAccount = accounts[0];
            console.log("Seçilen hesap:", selectedAccount);
            setAccount(selectedAccount)
          } else {
            console.error("Hiç hesap bulunamadı.");
          }

          const contract = new ethers.Contract(
            "0xe3cAF1175511FBFf54FB9eB6B8FBE3F956Fe1068",
            abi,
            signer
          );
          const properties = await contract.getProperties();
          setProperties(properties);
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
    <div className="App">
      <h4>Your Address: {account}</h4>
      <hr/>
      <h1>User Operations</h1>      
      <Page />
      <h1>Lists</h1>
      <Lists />
    </div>
  );
}

export default App;
