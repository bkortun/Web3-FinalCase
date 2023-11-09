import React, { Component } from "react";
import { ethers } from "ethers";
import abi from "../rentalABI.json";

class RentFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        propertyId: "",
        hirer: "",
        startDate: "",
        endDate: "",
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
        contract.rent(
          this.state.formData.propertyId,
          this.state.formData.hirer,
          parseInt(
            (new Date(this.state.formData.startDate).getTime() / 1000).toFixed(
              0
            )
          ),
          parseInt(
            (new Date(this.state.formData.endDate).getTime() / 1000).toFixed(0)
          )
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
          <label>Property Id:</label>
          <input
            type="text"
            name="propertyId"
            value={this.state.formData.propertyId}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Hirer Address:</label>
          <input
            type="text"
            name="hirer"
            value={this.state.formData.hirer}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={this.state.formData.startDate}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={this.state.formData.endDate}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default RentFormComponent;
