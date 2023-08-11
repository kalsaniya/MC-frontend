import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, Layout, Menu, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendIcon from "@mui/icons-material/Send";
import TempleBuddhistIcon from "@mui/icons-material/TempleBuddhist";
import { Footer } from "antd/es/layout/layout";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

// main code start

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Starts */}
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px" }}
      >
        <div theme="light" className="logo">
          <h2 className="text fs-3 text-center py-3 mb-0">
            <span className="sm-logo text-primary">
              <TempleBuddhistIcon />
            </span>
            <span className="lg-logo  text-primary">Mind-Collective</span>
          </h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[
            //Dashboard
            {
              label: "Dashboard",
              key: "",
              icon: <DashboardIcon className="fs-4" />,
            },

            {
              label: "Contacts",
              key: "contact",
              icon: <ContactPageIcon className="fs-4" />,
            },
            {
              label: "Custom Fields",
              key: "customfields",
              icon: <LabelImportantIcon className="fs-4" />,
            },
            {
              label: "Schedule",
              key: "schedule",
              icon: <AccessTimeFilledIcon className="fs-4" />,
            },

            // {
            //   label: "WA-Team",
            //   key: "wateam",
            //   icon: <WhatsAppIcon className="fs-4" />,
            //   children: [
            //     {
            //       label: "Message Template",
            //       key: "wamessagetemplate",
            //       icon: <SaveIcon className="fs-4" />,
            //     },
            //     {
            //       label: "Reports",
            //       key: "reportswateam",
            //       icon: <AssignmentIcon className="fs-4" />,
            //     },
            //   ],
            // },
            {
              label: "AutoWapSender",
              key: "autowapsender",
              icon: <SendIcon className="fs-4" />,
              children: [
                {
                  label: "AWS Dashboard",
                  key: "awsdashboard",
                  icon: <DashboardIcon className="fs-4" />,
                },

                {
                  label: "Message Template",
                  key: "messagetemplate",
                  icon: <SaveIcon className="fs-4" />,
                },
                {
                  label: "Reports",
                  key: "reportstemplate",
                  icon: <AssignmentIcon className="fs-4" />,
                },
              ],
            },
            {
              label: "API Documentation",
              key: "apidocumentation",
              icon: <IntegrationInstructionsIcon className="fs-4" />,
            },
            {
              label: "Settings",
              key: "settings",
              icon: <SettingsIcon className="fs-4" />,
              children: [
                {
                  label: "Profile",
                  key: "profile",
                  icon: <PersonIcon className="fs-4" />,
                },
              ],
            },
          ]}
        />
      </Sider>
      {/* Sidebar Ends */}

      {/* Sub Layout Starts */}
      <Layout>
        {/* Navbar Starts */}
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
            boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="d-flex gap-4 align-items-center">
            {/* <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div> */}
            <div className="d-flex gap-3 align-items-center dropdown">
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%" }}
                  src="https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                  alt=""
                />
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <div
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/view-profile"
                  >
                    <h5 className="mb-0">Admin</h5>
                    <p className="mb-0">admin@gmail.com</p>
                  </div>
                  <hr />
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="#"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{
                      height: "auto",
                      lineHeight: "20px",
                      color: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    to="/"
                  >
                    {/* <i class="ri-logout-circle-line"></i>  */}
                    <i
                      class="ri-shut-down-line"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Logout
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        {/* Navbar Ends */}

        {/* Dashboar Content Starts */}
        <Content
          style={{
            margin: "10px 5px",
            padding: 2,
            minHeight: 280,
            background: colorBgContainer,
            position: "relative", // Add this to make the position of the content relative
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
        {/* Dashboar Content Ends */}
        <Footer
          style={{
            textAlign: "center",
            background: colorBgContainer,
            boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset",
            marginTop: "20px",
          }}
        >
          <p>© 2023 Mind-collective</p>
        </Footer>
      </Layout>
      {/* Sub Layout Ends */}
    </Layout>
  );
};
export default MainLayout;
