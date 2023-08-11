import "./App.css";
import MainLayout from "./components/MainLayout";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import Customfields from "./pages/Customfields";
import Contacts from "./pages/Contacts";
import Templates from "./pages/Templates";
import Profile from "./pages/Profile";
import ReportsTemp from "./pages/ReportsTemp";
import ReportsContact from "./pages/ReportsContact";
import ApiDocumentation from "./pages/ApiDocumentation";
import TemplateSender from "./pages/TemplateSender";
import TemplateWaTeam from "./pages/TemplateWaTeam";
import Schedule from "./pages/Schedule";
import AwsDashboard from "./pages/AwsDashboard";
// import BasicSendMessage from "./pages/BasicSendMessage";
// import UsingTemplateSendMessage from "./pages/UsingTemplateSendMessage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="awsdashboard" element={<AwsDashboard />} />
          <Route path="contact" element={<Contacts />} />
          <Route path="customfields" element={<Customfields />} />
          <Route path="messagetemplate" element={<TemplateSender />} />
          <Route path="wamessagetemplate" element={<TemplateWaTeam />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reportstemplate" element={<ReportsTemp />} />
          <Route path="reportswateam" element={<ReportsContact />} />
          <Route path="apidocumentation" element={<ApiDocumentation />} />
          <Route path="schedule" element={<Schedule />} />
          {/* <Route path="basic" element={<BasicSendMessage />} />
          <Route path="usingtemplate" element={<UsingTemplateSendMessage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
