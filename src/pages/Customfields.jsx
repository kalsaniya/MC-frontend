import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, Space, Table, Tag } from "antd";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

const Customfields = () => {
  const [data, setData] = useState([]);
  const [editCustomId, setEditCustomId] = useState(null);
  const [custom, setCustom] = useState({
    title: "",
    description: "",
    type: "",
  });
  // const [showInTable, setShowInTable] = useState(false); // State variable for the checkbox

  const [isModalOpen, setIsModalOpen] = useState(false); // Track the modal visibility

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/contact/customfield"
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCustom = (_id) => {
    // Delete contact with the given ID
    axios
      .delete(`http://localhost:7000/api/contact/customfield/delete/${_id}`)
      .then((res) => {
        toast.success("Custom Field deleted successfully!");
        fetchData();
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };

  const handleChangeCustom = (e) => {
    const { name, value } = e.target;
    setCustom({
      ...custom,
      [name]: value,
    });
  };

  const handleEditCustom = (_id) => {
    const selectedCustom = data.find((customid) => customid._id === _id);

    if (selectedCustom) {
      setEditCustomId(_id); // Set the ID of the contact being edited
      setCustom({
        title: selectedCustom.title,
        description: selectedCustom.description,
        type: selectedCustom.type,
      }); // Populate the form fields with the selected contact data
    }

    setIsModalOpen(true);

    console.log(`Editing Custom with ID: ${_id}`);
  };

  const handleModalSave = () => {
    if (
      custom.title.trim() === "" ||
      custom.description.trim() === "" ||
      custom.type.trim() === ""
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }
    // Perform save/update logic based on the edited contact ID and form values
    if (editCustomId) {
      // Perform update logic
      axios
        .put(
          `http://localhost:7000/api/contact/customfield/edit/${editCustomId}`,
          custom
        )
        .then((res) => {
          toast.success("Custom Field updated successfully!");
          fetchData();
          setCustom({
            title: "",
            description: "",
            type: "",
          }); // Reset the contact form fields
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    } else {
      // Perform save logic
      axios
        .post("http://localhost:7000/api/contact/customfield/new", custom)
        .then((res) => {
          toast.success("Custom Field added successfully!");
          fetchData();
          setCustom({
            title: "",
            description: "",
            type: "",
          }); // Reset the contact form fields
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      render: (text, record, index) => index + 1,
      fixed: "left",
      width: 50,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      color: "blue",
      ellipsis: true,
      render: (type) => {
        let color = "default";

        // Set different colors based on type
        switch (type) {
          case "string":
            color = "blue";
            break;
          case "number":
            color = "green";
            break;
          case "date":
            color = "orange";
            break;
          case "datetime":
            color = "purple";
            break;
          default:
            color = "default";
        }

        return (
          <Tag color={color} key={type}>
            {type.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "CREATED ON",
      dataIndex: "createdOn",
      key: "createdOn",
      ellipsis: true,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },

    {
      title: "ACTION",
      key: "action",
      width: 150,

      render: (text, record) => (
        <Space size="middle">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="edit-btn"
            onClick={() => handleEditCustom(record._id)}
          >
            <i class="ri-pencil-fill"></i>
          </button>

          <button
            onClick={() => handleDeleteCustom(record._id)}
            className="delete-btn"
          >
            <i class="ri-delete-bin-fill"></i>
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div class="page-content w-100">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h3 class="mb-sm-0 py-3">Custom Field</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xxl-12">
            <div id="contactList" class="card">
              <div class="card-header py-3">
                <div class="d-flex align-items-center flex-wrap gap-2">
                  <div class="d-flex flex-wrap flex-grow-1 gap-2">
                    {/* <!-- Button trigger modal --> */}
                    <button
                      type="button"
                      class="btn btn-primary add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i class="ri-add-fill me-1 align-bottom"></i> Add Custom
                      Field
                    </button>

                    {/* <!-- Modal --> */}
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden={!isModalOpen}
                      style={{ display: isModalOpen ? "block" : "none" }}
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                              {editCustomId
                                ? "Update Custom Field"
                                : "Add Custom Field"}
                            </h5>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            <Box>
                              <TextField
                                color="primary"
                                fullWidth
                                label="Title"
                                name="title"
                                value={custom.title}
                                onChange={handleChangeCustom}
                                margin="normal"
                                required
                                autoFocus
                              />
                              <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={custom.description}
                                onChange={handleChangeCustom}
                                margin="normal"
                                required
                              />
                              <select
                                class="form-select"
                                aria-label="Default select example"
                                name="type"
                                value={custom.type}
                                onChange={handleChangeCustom}
                              >
                                <option selected value="">
                                  Select Type
                                </option>
                                <option value="string" name="string">
                                  String
                                </option>
                                <option value="number" name="number">
                                  Number
                                </option>
                                <option value="date" name="date">
                                  Date
                                </option>
                                <option value="datetime" name="datetime">
                                  Date & Time
                                </option>
                              </select>

                              {/* Checkbox for showing the field in the contact table */}
                              {/* <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={showInTable}
                                    onChange={(e) =>
                                      setShowInTable(e.target.checked)
                                    }
                                  />
                                }
                                label="Show this field in the contact table"
                              /> */}
                            </Box>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              onClick={handleModalSave}
                              type="button"
                              class="btn btn-primary"
                            >
                              {editCustomId
                                ? "Update Custom Field"
                                : "Add Custom Field"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex-shrink-0"></div>
                </div>
                <div class="d-flex align-items-center flex-wrap gap-2 mt-2">
                  <div class="flex-shrink-0">
                    <div class="hstack text-nowrap gap-2 align-item-center"></div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <Table
                  dataSource={data}
                  columns={columns}
                  rowKey="_id"
                  scroll={{ x: true }}
                  style={{ overflowX: data.length > 5 ? "scroll" : "hidden" }} // Show scrollbar only if data is lengthy
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customfields;
