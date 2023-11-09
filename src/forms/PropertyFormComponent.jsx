import React, { Component } from 'react';
import { ethers } from 'ethers';
import abi from '../rentalABI.json';

class PropertyFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        location: '',
        propertyType:''
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
      case "Residential":
        return 0x00
      case "Commercial":
        return 0x01
      default:
        break;
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      await window.ethereum.send('eth_requestAccounts',[]);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract("0xe3cAF1175511FBFf54FB9eB6B8FBE3F956Fe1068", abi, signer);
      contract.enterProperty(this.state.formData.name,this.state.formData.location,this.handleSenderType(this.state.formData.propertyType))

    } catch (error) {
      console.error('Kontrat bağlantısı başarısız:', error);
    }
    console.log(this.state.formData);
    
  };

  render() {
    const {data} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Property Name:</label>
          <input
            type="text"
            name="name"
            value={this.state.formData.name}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={this.state.formData.location}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label for="propertyType">Sender Type:</label>
          <select onChange={this.handleChange} id="propertyType" name="propertyType">
            <option value={null} selected>Default Value</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>          
        </div>
        <button type="submit">Submit</button>
        {data}
      </form>
    );
  }
}

export default PropertyFormComponent;
