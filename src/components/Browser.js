import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import * as moment from 'moment'

class Browser extends Component {

  constructor () {
    super();
    this.state = {};
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
      .then( kitty => {
        this.setState({
          genes: kitty.genes,
          generation: kitty.generation,
          birthTime: moment.unix( +kitty.birthTime ).format( 'MMMM Do YYYY' ),
        });
      })
      .then( () => this.input.value = '' );
  }

  render() {
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>

        <form onSubmit={ this.findKittyById }>
          <h4>Kitty ID:</h4>
          <input
            type="text"
            placeholder="Kitty ID"
            ref={ el => this.input = el }
          ></input>
          <button type="submit">Find Kitty</button>
        </form>

        {
          this.state.genes &&
          <div>
            <h4>Genes</h4>
            <p>{ this.state.genes }</p>
          </div>
        }

        {
          this.state.generation &&
          <div>
            <h4>Generation</h4>
            <p>{ this.state.generation }</p>
          </div>
        }

        {
          this.state.birthTime &&
          <div>
            <h4>Birth Time</h4>
            <p>{ this.state.birthTime }</p>
          </div>
        }
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
