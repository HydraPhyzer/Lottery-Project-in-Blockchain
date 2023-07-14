import React from "react";
import "./Header.css";

const Header = ({Func}) => {
  return (
    <div
      style={{
        width: "90vw",
        backgroundColor: "#f1c40f",
        padding: 10,
        borderRadius: 3,
        display: "flex",
        justifyContent: "space-around",
        gap: 50,
        margin:"10px 0px"
      }}
    >
      <button className="Button" onClick={()=>{Func("Home")}}>Home</button>
      <button className="Button" onClick={()=>{Func("Manager")}}>Manager</button>
      <button className="Button" onClick={()=>{Func("Player")}}>Player</button>
    </div>
  );
};

export default Header;
