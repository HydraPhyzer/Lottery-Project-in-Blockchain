import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Header from "./Header";
import "./App.css";
import { ContractLoader } from "../Utils/ContractLoader";

const App = () => {
  let [State, setState] = useState({
    WEB3: null,
    Contract: null,
  });
  let [Reload, setReload] = useState(false);
  let [Winner, setWinner] = useState(null);

  let GetInitials = async () => {
    let Provider = null;
    if (window.ethereum) {
      Provider = window.ethereum;
      try {
        await Provider.enable();
      } catch {
        alert("Provider Is Not Available");
      }
    } else if (Provider == null) {
      alert("Hey");
      Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }
    if (Provider) {
      setState({
        ...State,
        WEB3: new Web3(Provider),
        Contract: await ContractLoader("Lottery", new Web3(Provider)),
      });
    }
  };

  useEffect(() => {
    GetInitials();
  }, []);
  const Home = () => {
    return (
      <div style={{ margin: 20, color: "white" }}>
        <ul
          style={{
            listStyleType: "I",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <li>
            The contract represents a simple lottery system where participants
            can enter the lottery by sending at least 1 Ether to the contract's
            address.
          </li>
          <li>
            The contract has a manager address who is responsible for initiating
            certain actions within the contract.
          </li>
          <li>
            The manager address is set during the contract's deployment and is
            the address of the deployer (msg.sender).
          </li>
          <li>
            he list of participants is stored in the dynamic array called
            Players, which consists of payable addresses (address payable[]).
          </li>
          <li>
            The contract's receive() function is triggered whenever Ether is
            sent to the contract. It verifies that at least 1 Ether is sent and
            adds the sender's address to the Players array if they haven't
            participated before.
          </li>
          <li>
            The PickWinner() function can only be called by the manager and
            ensures that there are at least three players participating in the
            lottery before proceeding.
          </li>
          <li>
            The PickWinner() function picks a random winner based on the
            generated random number from the Random() function and transfers the
            entire balance of the contract to the winner.
          </li>
          <li>
            The GetPlayers() function allows anyone to view the list of
            participating addresses in the current lottery round.
          </li>
        </ul>
      </div>
    );
  };

  const Manager = () => {
    let [Acc, setAcc] = useState(null);
    let [Bal, setBal] = useState(null);
    let [Text, setText] = useState(null);
    useEffect(() => {
      State.WEB3 &&
        State.WEB3.eth.getAccounts().then(async (acc) => {
          let Man = await State.Contract.methods
            .Manager()
            .call({ from: acc[0] });
          setAcc(Man);
          setBal(
            await State.WEB3.utils.fromWei(
              await State.Contract.methods.GetBalance().call({ from: acc[0] }),
              "ether"
            )
          );
        });
    }, [State.WEB3]);

    let PickWinner = async () => {
      try {
        await State.Contract.methods.PickWinner().send({ from: Acc });
        setWinner(await State.Contract.methods.Winner().call({ from: Acc }));
        setText("Winner Picked 🎉");
      } catch (error) {
        setText("Error Occured While Picking Winner😢");
      }
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            flexDirection: "column",
            width: "50%",
          }}
        >
          <div
            style={{ border: "2px solid black", padding: 10, width: "100%" }}
          >
            <span>Manager : </span>
            <span style={{ color: "#e74c3c" }}>{Acc}</span>
          </div>
          <div
            style={{ border: "2px solid black", padding: 10, width: "100%" }}
          >
            <span>Contract Balance : </span>
            <span>{Bal} Ethers</span>
          </div>
          <div
            style={{ border: "2px solid black", padding: 10, width: "100%" }}
          >
            <button
              className="Button"
              style={{ width: "100%" }}
              onClick={PickWinner}
            >
              Pick Winner
            </button>
          </div>
          <p>{Text}</p>
        </div>
      </div>
    );
  };

  const Player = () => {
    let [Bal, setBal] = useState(null);
    let [PAcc, setPAcc] = useState(null);
    let [CAcc, setCAcc] = useState(null);
    let [Members, setMembers] = useState(null);
    useEffect(() => {
      State.WEB3 &&
        State.WEB3.eth.getAccounts().then(async (acc) => {
          setPAcc(acc[0]);
          setBal(
            await State.WEB3.utils.fromWei(
              await State.WEB3.eth.getBalance(acc[0]),
              "ether"
            )
          );
          setCAcc(await State.Contract.options.address);
          let Mem = await State.Contract.methods.GetPlayers().call();
          setMembers(Mem);
        });
    }, [State.WEB3, State]);
    return (
      <div>
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              flexDirection: "column",
              width: "40%",
            }}
          >
            <div
              style={{ border: "2px solid black", padding: 10, width: "100%" }}
            >
              <span>Your Account : </span>
              <span style={{ color: "#e74c3c" }}>{PAcc}</span>
            </div>
            <div
              style={{ border: "2px solid black", padding: 10, width: "100%" }}
            >
              <span>Your Balance : </span>
              <span>{Bal} Ethers</span>
            </div>
            <div
              style={{ border: "2px solid black", padding: 10, width: "100%" }}
            >
              <span>Contract : </span>
              <span style={{ color: "#e74c3c" }}>{CAcc} </span>
            </div>
          </div>
          <div style={{ border: "2px solid black", padding: 10, width: "50%" }}>
            Participants Are Below :
            <ul style={{ listStyle: "none" }}>
              {Members &&
                Members.map((item, key) => {
                  return (
                    <li style={{ color: "#e74c3c" }} key={key}>
                      {item}
                    </li>
                  );
                })}
            </ul>
            {Winner && (
              <div>
                <p>From Participants Winner Was : </p>
                <p style={{ color: "#e74c3c" }}>{Winner}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const [Tab, setTab] = useState(<Home />);
  let ChangeTab = (TabName) => {
    TabName == "Home"
      ? setTab(<Home />)
      : TabName == "Manager"
      ? setTab(<Manager />)
      : setTab(<Player />);
  };

  return (
    <div className="Main">
      <div className="A">
        <Header Func={ChangeTab} />
      </div>
      <div className="B">{Tab}</div>
    </div>
  );
};

export default App;
