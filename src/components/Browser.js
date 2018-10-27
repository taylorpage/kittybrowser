import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import moment from 'moment';
import axios from 'axios';

class Browser extends Component {

  constructor () {
    super();
    this.state = {};
    this.submitForm = this.submitForm.bind( this );
    this.findKittyById = this.findKittyById.bind( this );
    this.findKittyImage = this.findKittyImage.bind( this );
    this.randomizeId = this.randomizeId.bind( this );
  }

  componentDidMount () {
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

  submitForm ( e ) {
    e.preventDefault();
    this.input.value && Promise.all([
      this.findKittyById(),
      this.findKittyImage()
    ])
    .then( kitty => {
      const info = kitty[ 0 ];
      const image = kitty[ 1 ];
      this.setState({
        genes: info.genes,
        generation: info.generation,
        birthTime: moment.unix( +info.birthTime ).format( 'MMMM Do YYYY' ),
        image: image.data.image_url,
        id: this.input.value,
      });
    })
    .then( () => this.input.value = '' );
  }

  findKittyById () {
    const contract = this.context.drizzle.contracts.CryptoKitties;
    return contract.methods
      .getKitty( this.input.value )
      .call();
  }

  findKittyImage () {
    return axios.get( `https://api.cryptokitties.co/kitties/${ this.input.value }` );
  }

  randomizeId () {
    this.input.value = Math.floor( Math.random() * 37000 );
  }

  render() {
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>

        <form onSubmit={ this.submitForm }>
          <h4>Kitty ID: { this.state.id }</h4>
          <input
            type="text"
            placeholder="Kitty ID"
            ref={ el => this.input = el }
          ></input>
          <button type="submit">Find Kitty</button>
          <button onClick={ this.randomizeId } type="submit">Random Kitty</button>
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

        {
          this.state.image &&
          <img alt="Not Available" src={ this.state.image } />
        }
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
