import React, { Component } from "react";
import { ethers } from "ethers";
import abi from "../rentalABI.json";

class SendReportFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        agreementId: "",
        subject: "",
        message: "",
        senderType: "",
      },
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  handleSenderType(value) {
    switch (value) {
      case "Renter":
        return 0x00
      case "Hirer":
        return 0x01
      default:
        break;
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      await window.ethereum.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        "0xe3cAF1175511FBFf54FB9eB6B8FBE3F956Fe1068",
        abi,
        signer
      );
      try {
        contract.sendReportToRenter(
          this.state.formData.agreementId,
          this.state.formData.subject,
          this.state.formData.message,
          this.handleSenderType(this.state.formData.senderType)
        );
      } catch (error) {
        console.error("Kontrat işlemi başarısız:", error);
      }
    } catch (error) {
      console.error("Kontrat bağlantısı başarısız:", error);
    }
    console.log(this.state.formData);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Agreement Id:</label>
          <input
            type="text"
            name="agreementId"
            value={this.state.formData.agreementId}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={this.state.formData.subject}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Message:</label>
          <input
            type="text"
            name="message"
            value={this.state.formData.message}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label for="sender">Sender Type:</label>
          <select onChange={this.handleChange} id="senderType" name="senderType">
            <option value={null} selected>Default Value</option>
            <option value="Renter">Renter</option>
            <option value="Hirer">Hirer</option>
          </select>          
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default SendReportFormComponent;
