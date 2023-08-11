import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table } from "antd";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

const TemplateSender = () => {
  const [data, setData] = useState([]);

  const [template, setTemplate] = useState({
    templateName: "",
    textItem: "",
    file: "",
    attachment: "",
    subscribe: false,
  });

  const [editTemplateId, setEditTemplateId] = useState(null);

  const handleEditTemplate = (_id) => {
    const selectedTemplate = data.find((template) => template._id === _id);

    if (selectedTemplate) {
      setEditTemplateId(_id); // Set the ID of the contact being edited
      setTemplate({
        templateName: selectedTemplate.templateName,
        textItem: selectedTemplate.textItem,
        file: selectedTemplate.file,
        attachment: selectedTemplate.attachment,
        subscribe: selectedTemplate.subscribe,
      }); // Populate the form fields with the selected contact data
    }
    console.log(`Editing template with ID: ${_id}`);
  };

  const handleChangeTemplate = (e) => {
    const { name, value, type, checked } = e.target;
    // If the input type is a checkbox, set the value based on the checked state
    const inputValue = type === "checkbox" ? checked : value;
    setTemplate({
      ...template,
      [name]: inputValue,
    });
  };

  // Fetch Contact data on component mount
  useEffect(() => {
    fetchTemplateData();
  }, []);

  const fetchTemplateData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/template/getalltemplate"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching customs data:", error);
    }
  };

  console.log(data);

  // currently running code

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine the value for the subscribe field based on the toggle state
    const subscribeValue = template.subscribe ? true : false;

    // Combine the template data and custom fields data into a single object
    const templateData = {
      ...template,
      subscribe: subscribeValue,
    };

    if (editTemplateId) {
      // Make an HTTP POST request to send the template data to the backend
      axios
        .put(
          `http://localhost:7000/api/template/update/${editTemplateId}`,
          templateData
        )
        .then((response) => {
          // Clear the form inputs
          setTemplate({
            templateName: "",
            textItem: "",
            file: "",
            attachment: "",
            subscribe: "",
          });

          // Show SweetAlert2 modal with a "saved" button on success
          Swal.fire({
            title: "Template Updated successfully!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Saved",
          }).then(() => {
            // Fetch the updated template data
            fetchTemplateData();
          });
        })
        .catch((error) => {
          // Handle errors, e.g., show error message
          Swal.fire(
            "Error",
            "Error creating template. Please try again.",
            "error"
          );
        });
    } else {
      // Make an HTTP POST request to send the template data to the backend
      axios
        .post("http://localhost:7000/api/template/create", templateData)
        .then((response) => {
          // Clear the form inputs
          setTemplate({
            templateName: "",
            textItem: "",
            file: "",
            attachment: "",
            subscribe: "",
          });

          // Show SweetAlert2 modal with a "saved" button on success
          Swal.fire({
            title: "Template created successfully!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Saved",
          }).then(() => {
            // Fetch the updated template data
            fetchTemplateData();
          });
        })
        .catch((error) => {
          // Handle errors, e.g., show error message
          Swal.fire(
            "Error",
            "Error creating template. Please try again.",
            "error"
          );
        });
    }
  };

  const handleDeleteTemplate = async (_id) => {
    // Show SweetAlert2 confirm dialog
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      // Show a loading spinner while holding the action
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      // Wait for 3 seconds using setTimeout before confirming deletion
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Delete the template after 3 seconds
      axios
        .delete(`http://localhost:7000/api/template/delete/${_id}`)
        .then((res) => {
          fetchTemplateData();
          Swal.fire("Deleted!", "Template deleted successfully!", "success");
        })
        .catch((error) => {
          Swal.fire("Error", "Something went wrong!", "error");
        });
    }
  };

  console.log(template);

  const columns = [
    {
      title: "ID",
      key: "_id",
      dataIndex: "_id",
      fixed: "left",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (text, record) => (
        <Space size="middle">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="edit-btn"
            onClick={() => handleEditTemplate(record._id)}
          >
            <i class="ri-pencil-fill"></i>
          </button>

          <button
            onClick={() => handleDeleteTemplate(record._id)}
            className="delete-btn"
          >
            <i class="ri-delete-bin-fill"></i>
          </button>
        </Space>
      ),
    },
    {
      title: "Creation Time",
      dataIndex: "currentIndiaTime",
      key: "currentIndiaTime",
      ellipsis: true,
      render: (currentIndiaTime) => new Date(currentIndiaTime).toLocaleString(),
    },
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      ellipsis: true,
      render: (textItem) => (
        <div style={{ maxWidth: "200px" }}>
          {textItem.length > 10 ? `${textItem.substring(0, 11)}...` : textItem}
        </div>
      ),
    },
    {
      title: "Text Item",
      dataIndex: "textItem",
      key: "textItem",
      ellipsis: true,
      render: (textItem) => (
        <div style={{ maxWidth: "200px" }}>
          {textItem.length > 10 ? `${textItem.substring(0, 11)}...` : textItem}
        </div>
      ),
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      ellipsis: true,
      render: (textItem) => (
        <div style={{ maxWidth: "200px" }}>
          {textItem.length > 10 ? `${textItem.substring(0, 11)}...` : textItem}
        </div>
      ),
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      ellipsis: true,
      render: (textItem) => (
        <div style={{ maxWidth: "200px" }}>
          {textItem.length > 10 ? `${textItem.substring(0, 11)}...` : textItem}
        </div>
      ),
    },
    {
      title: "UnSubscribe",
      dataIndex: "subscribe",
      key: "subscribe",
      ellipsis: true,
      render: (subscribe) => (
        <span style={{ color: subscribe ? "green" : "red" }}>
          {subscribe ? "On" : "Off"}
        </span>
      ),
    },
  ];

  return (
    <div class="page-content w-100">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h3 class="mb-sm-0 py-3">Message Templates AWS</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xxl-12">
            <div id="contactList" class="card">
              <div class="card-header py-3">
                <div class="d-flex align-items-center flex-wrap gap-2">
                  <div class="d-flex flex-wrap flex-grow-1 gap-2">
                    <button
                      type="button"
                      class="btn btn-primary add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i class="ri-add-fill me-1 align-bottom"></i> Create New
                    </button>
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                              {editTemplateId
                                ? "Update Message Template"
                                : "Create Message Template"}
                            </h5>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            {/* Here You can create the form */}
                            <form onSubmit={handleSubmit}>
                              <div>
                                <TextField
                                  color="primary"
                                  size="small"
                                  fullWidth
                                  label="Template Name"
                                  margin="normal"
                                  type="text"
                                  name="templateName"
                                  value={template.templateName}
                                  onChange={handleChangeTemplate}
                                  required
                                  autoFocus
                                />
                              </div>
                              {/* new fields */}
                              <div>
                                <TextField
                                  color="primary"
                                  label="Text Item"
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  type="text"
                                  name="textItem"
                                  value={template.textItem}
                                  onChange={handleChangeTemplate}
                                />
                              </div>

                              <div>
                                <FormControl fullWidth size="small">
                                  <InputLabel id="demo-simple-select-label">
                                    Select File
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="file"
                                    value={template.file}
                                    label="Select File"
                                    onChange={handleChangeTemplate}
                                  >
                                    <MenuItem
                                      name="attachment"
                                      value="attachment"
                                    >
                                      Attachment
                                    </MenuItem>
                                    <MenuItem
                                      name="personalizeattachment"
                                      value="personalizeattachment"
                                    >
                                      Personalize Attachment
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                              <div>
                                <TextField
                                  color="primary"
                                  size="small"
                                  fullWidth
                                  label="Attachment"
                                  margin="normal"
                                  type="text"
                                  name="attachment"
                                  value={template.attachment}
                                  onChange={handleChangeTemplate}
                                  required
                                  autoFocus
                                />
                              </div>
                              <div>
                                <div class="form-check form-switch">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="subscribe"
                                    checked={template.subscribe}
                                    onChange={handleChangeTemplate}
                                    id="flexSwitchCheckDefault"
                                  />
                                  <label
                                    class="form-check-label"
                                    htmlFor="flexSwitchCheckDefault"
                                  >
                                    Unsubscribe
                                  </label>
                                </div>
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
                                  type="submit"
                                  data-bs-dismiss="modal"
                                  class="btn btn-primary"
                                >
                                  {editTemplateId ? "Update " : "Create "}
                                </button>
                              </div>
                            </form>
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

export default TemplateSender;
