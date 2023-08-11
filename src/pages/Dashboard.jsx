import React from "react";

import { Button, Card } from "antd";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleContact = () => {
    navigate("/dashboard/contact");
  };
  return (
    <div>
      {/* <Card style={{ width: 300, textAlign: "center" }}>
        <BusinessCenterIcon />
        <h4>CRM</h4>
        <p>One stop solution to manage your contacts.</p>
        <Button
          type="primary"
          onClick={handleContact}
          style={{ width: "100%" }}
        >
          Go to CRM
        </Button>
      </Card> */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <h1>
          Welcome to the{" "}
          <span style={{ color: "#0D6EFD" }}>Mind Collective</span>{" "}
        </h1>
        <h2
          style={{
            color: "rgb(211, 32, 32)",
          }}
        >
          Dashboard
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
