import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';

class Browser extends Component {

  constructor () {
    super();
    this.findKittyById = this.findKittyById.bind( this );
  }

  componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider);

    // Initialize the contract instance

    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS,
    );

    // Add the contract to the drizzle store

    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });
  }

  findKittyById ( e ) {
    e.preventDefault();
    const contract = this.context.drizzle.contracts.CryptoKitties;
    contract.methods
      .getKitty( this.input.value )
      .call()
      .then( data => console.log( data ));
  }

  render() {
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>

        <form onSubmit={ this.findKittyById }>
          <label>Kitty ID:</label>
          <input
            type="text"
            placeholder="Kitty ID"
            ref={ el => this.input = el }
          ></input>
          <button type="submit">Find Kitty</button>
        </form>

        {/* Display Kitty info here */}
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
