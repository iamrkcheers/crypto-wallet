import React, { Component } from "react";
import daiLogo from "../daiLogo.png";
import "./App.css";
import Web3 from "web3";
import DaiTokenMockThree from "../abis/DaiTokenMockThree.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non Ethereum browser detected. You should consider trying MetaMask !"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const daiTokenAddress = "0x22EdFd9b8D5Cb9c54D51756A9E14866E5B62B5Ef"; // replace dai address here
    const daiTokenMock = new web3.eth.Contract(
      DaiTokenMockThree.abi,
      daiTokenAddress
    );
    this.setState({ daiTokenMock });

    const balance = await daiTokenMock.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ balance: web3.utils.fromWei(balance.toString(), "Ether") });

    const transactions = await daiTokenMock.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: { from: this.state.account },
    });
    this.setState({ transactions });
  }

  transfer(recipient, amount) {
    this.state.daiTokenMock.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      daiTokenMock: null,
      balance: 0,
      transactions: [],
    };

    this.transfer = this.transfer.bind(this);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.linkedin.com/in/rishabh-kashyap-735879117/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DAI WALLET
          </a>
        </nav>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ width: "500px" }}
              >
                <a
                  href="https://www.linkedin.com/in/rishabh-kashyap-735879117/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={daiLogo} width="150" />
                </a>

                <h1>{this.state.balance} DAI</h1>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const recipient = this.recipient.value;
                    const amount = window.web3.utils.toWei(
                      this.amount.value,
                      "Ether"
                    );
                    this.transfer(recipient, amount);
                  }}
                >
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => {
                        this.recipient = input;
                      }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required
                    />
                  </div>

                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => {
                        this.amount = input;
                      }}
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Send
                  </button>
                </form>

                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key}>
                          <td>{tx.returnValues.to}</td>
                          <td>
                            {window.web3.utils.fromWei(
                              tx.returnValues.value.toString(),
                              "Ether"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
