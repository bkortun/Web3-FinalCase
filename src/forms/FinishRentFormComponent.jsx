import React, { Component } from 'react';
import { ethers } from "ethers";
import abi from "../rentalABI.json";

class FinishRentFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        agreementId: '',
        reason: ''
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
        contract.finishRent(
          this.state.formData.agreementId,
          this.state.formData.reason
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
          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            value={this.state.formData.reason}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default FinishRentFormComponent;
