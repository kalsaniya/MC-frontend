import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table } from "antd";

import { TextField } from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CustomTextFields from "./CustomTextFields";
import CustomFileFields from "./CustomFileFields";
import CustomCaptionFields from "./CustomCaptionFields";
import Swal from "sweetalert2";

const Templates = (file) => {
  const [data, setData] = useState([]);

  const [template, setTemplate] = useState({
    templateName: "",
    randomText: false,
    textItem: "",
    fileItem: "",
    captionItem: "",
  });

  const [textFields, setTextFields] = useState([]); // Initialize with an empty field
  const [fileFields, setFileFields] = useState([]); // Initialize with an empty field
  const [captionFields, setCaptionFields] = useState([]); // Initialize with an empty field
  const [editTemplateId, setEditTemplateId] = useState(null);

  const handleEditTemplate = (_id) => {
    const selectedTemplate = data.find((template) => template._id === _id);

    if (selectedTemplate) {
      setEditTemplateId(_id); // Set the ID of the contact being edited
      setTemplate({
        templateName: selectedTemplate.templateName,
        randomText: selectedTemplate.randomText,
        textItem: selectedTemplate.textItem.map((item) => item.value),
        fileItem: selectedTemplate.fileItem.map((item) => item.value),
        captionItem: selectedTemplate.captionItem.map((item) => item.value),
      }); // Populate the form fields with the selected contact data
    }

    console.log(`Editing template with ID: ${_id}`);
  };

  //   Text Items
  const handleAddTextItem = () => {
    setTextFields([...textFields, ""]);
  };

  const handleTextItemChange = (index, value) => {
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = value;
    setTextFields(updatedTextFields);
  };

  const handleTextDeleteItem = (index) => {
    const updatedTextFields = [...textFields];
    updatedTextFields.splice(index, 1);
    setTextFields(updatedTextFields);
  };

  //File Items

  const handleAddFileItem = () => {
    setFileFields([...fileFields, ""]);
  };

  const handleFileItemChange = (index, value) => {
    const updatedFileFields = [...fileFields];
    updatedFileFields[index] = value;
    console.log(updatedFileFields);
    setFileFields(updatedFileFields);
  };

  const handleFileDeleteItem = (index) => {
    const updatedFileFields = [...fileFields];
    updatedFileFields.splice(index, 1);

    setFileFields(updatedFileFields);
  };

  //Caption Items

  const handleAddCaptionItem = () => {
    setCaptionFields([...captionFields, ""]);
  };

  const handleCaptionItemChange = (index, value) => {
    const updatedCaptionFields = [...captionFields];
    updatedCaptionFields[index] = value;
    setCaptionFields(updatedCaptionFields);
  };

  const handleCaptionDeleteItem = (index) => {
    const updatedCaptionFields = [...captionFields];
    updatedCaptionFields.splice(index, 1);
    setCaptionFields(updatedCaptionFields);
  };

  //**************main code*****************

  const handleChangeTemplate = (e) => {
    const { name, value, type } = e.target;
    // For checkbox input type (randomText), handle the value as a boolean
    const fieldValue = type === "checkbox" ? e.target.checked : value;

    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: fieldValue,
    }));
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

  // main code

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Combine the template data and custom fields data into a single object
  //   const templateData = {
  //     ...template,
  //     textItem: textFields.map((field) => ({ value: field })),
  //     fileItem: fileFields.map((field) => ({ value: field })),
  //     captionItem: captionFields.map((field) => ({ value: field })),
  //   };

  //   // Make an HTTP POST request to send the template data to the backend
  //   axios
  //     .post("http://localhost:7000/api/template/create", templateData)
  //     .then((response) => {
  //       // Clear the form inputs
  //       setTemplate({
  //         templateName: "",
  //         randomText: false,
  //         textItem: "",
  //         fileItem: "",
  //         captionItem: "",
  //       });
  //       setTextFields([]);
  //       setFileFields([]);
  //       setCaptionFields([]);

  //       // Show SweetAlert2 modal with a "saved" button on success
  //       Swal.fire({
  //         title: "Template created successfully!",
  //         icon: "success",
  //         showCancelButton: false,
  //         confirmButtonColor: "#3085d6",
  //         confirmButtonText: "Saved",
  //       }).then(() => {
  //         // Fetch the updated template data
  //         fetchTemplateData();
  //       });
  //     })
  //     .catch((error) => {
  //       // Handle errors, e.g., show error message
  //       Swal.fire(
  //         "Error",
  //         "Error creating template. Please try again.",
  //         "error"
  //       );
  //     });
  // };

  // main code

  // currently running code

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine the template data and custom fields data into a single object
    const templateData = {
      ...template,
      textItem: textFields.map((field) => ({ value: field })),
      fileItem: fileFields.map((field) => ({ value: field })),
      captionItem: captionFields.map((field) => ({ value: field })),
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
            randomText: false,
            textItem: "",
            fileItem: "",
            captionItem: "",
          });
          setTextFields([]);
          setFileFields([]);
          setCaptionFields([]);

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
    } else {
      // Make an HTTP POST request to send the template data to the backend
      axios
        .post("http://localhost:7000/api/template/create", templateData)
        .then((response) => {
          // Clear the form inputs
          setTemplate({
            templateName: "",
            randomText: false,
            textItem: "",
            fileItem: "",
            captionItem: "",
          });
          setTextFields([]);
          setFileFields([]);
          setCaptionFields([]);

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

  // currently running code

  // experimental code
  // experimental code

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

  const handleDeleteExistingField = (fieldType, index) => {
    const updatedTemplate = { ...template };
    switch (fieldType) {
      case "text":
        updatedTemplate.textItem.splice(index, 1);
        break;
      case "file":
        updatedTemplate.fileItem.splice(index, 1);
        break;
      case "caption":
        updatedTemplate.captionItem.splice(index, 1);
        break;
      default:
        break;
    }
    setTemplate(updatedTemplate);
  };

  console.log(data);
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
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      ellipsis: true,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 50,
      render: (text, record) => {
        // Combine textItem, fileItem, and captionItem into a single string
        const textItems = record.textItem.map((item) => item.value).join(", ");
        const fileItems = record.fileItem.map((item) => item.value).join(", ");
        const captionItems = record.captionItem
          .map((item) => item.value)
          .join(", ");
        return `${textItems} | ${fileItems} | ${captionItems}`;
      },
    },

    {
      title: "Randomize",
      dataIndex: "randomText",
      key: "randomText",
      ellipsis: true,
      render: (text, record) => (record.randomText ? "True" : "False"),
    },
    {
      title: "Creation Time",
      dataIndex: "currentIndiaTime",
      key: "currentIndiaTime",
      ellipsis: true,
      render: (currentIndiaTime) => new Date(currentIndiaTime).toLocaleString(),
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
  ];

  return (
    <div class="page-content w-100">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h3 class="mb-sm-0 py-3">Message Templates</h3>
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
                              <div>
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  name="randomText"
                                  value={template.randomText}
                                  onChange={handleChangeTemplate}
                                  type="checkbox"
                                >
                                  <option selected value="">
                                    Yes/No
                                  </option>
                                  <option value={true} name="true">
                                    Yes
                                  </option>
                                  <option value={false} name="false">
                                    No
                                  </option>
                                </select>
                              </div>

                              {editTemplateId ? (
                                <div class="modal-body">
                                  {/* <h5>Existing Custom Fields:</h5> */}
                                  <ul>
                                    {template?.textItem?.map((text, index) => (
                                      <li
                                        key={`existing-text-${index}`}
                                        style={{ display: "flex" }}
                                      >
                                        <p>TEXT : {text} </p>
                                        <i
                                          style={{
                                            color: "#F34D4D",
                                            fontSize: "20px",
                                            marginLeft: "15px",
                                            cursor: "pointer",
                                          }}
                                          class="ri-delete-bin-fill"
                                          onClick={() =>
                                            handleDeleteExistingField(
                                              "text",
                                              index
                                            )
                                          }
                                        ></i>
                                        {/* <button className="btn btn-danger btn-sm"></button> */}
                                      </li>
                                    ))}
                                    {template?.fileItem?.map((text, index) => (
                                      <li
                                        key={`existing-text-${index}`}
                                        style={{ display: "flex" }}
                                      >
                                        <p>IMAGE : {text}</p>
                                        <i
                                          style={{
                                            color: "#F34D4D",
                                            fontSize: "20px",
                                            marginLeft: "15px",
                                            cursor: "pointer",
                                          }}
                                          class="ri-delete-bin-fill"
                                          onClick={() =>
                                            handleDeleteExistingField(
                                              "text",
                                              index
                                            )
                                          }
                                        ></i>
                                      </li>
                                    ))}
                                    {template?.captionItem?.map(
                                      (text, index) => (
                                        <li
                                          key={`existing-text-${index}`}
                                          style={{ display: "flex" }}
                                        >
                                          <p>Caption : {text}</p>

                                          <i
                                            style={{
                                              color: "#F34D4D",
                                              fontSize: "20px",
                                              marginLeft: "15px",
                                              cursor: "pointer",
                                            }}
                                            class="ri-delete-bin-fill"
                                            onClick={() =>
                                              handleDeleteExistingField(
                                                "text",
                                                index
                                              )
                                            }
                                          ></i>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}

                              {/* Add text item */}
                              <div style={{ margin: "20px 0" }}>
                                {textFields.map((field, index) => (
                                  <CustomTextFields
                                    key={index}
                                    name={field}
                                    value={field}
                                    onChange={(e) =>
                                      handleTextItemChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    onDelete={() => handleTextDeleteItem(index)}
                                  />
                                ))}
                                <Button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  type="dashed"
                                  onClick={handleAddTextItem}
                                  icon={<PlusOutlined />}
                                >
                                  Add Text item
                                </Button>
                              </div>

                              {/* Add file item */}

                              <div style={{ margin: "20px 0" }}>
                                {fileFields.map((field, index) => (
                                  <CustomFileFields
                                    key={index}
                                    name={field}
                                    value={field}
                                    onChange={(e) =>
                                      handleFileItemChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    onDelete={() => handleFileDeleteItem(index)}
                                  />
                                ))}

                                <Button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  type="dashed"
                                  onClick={handleAddFileItem}
                                  icon={<PlusOutlined />}
                                >
                                  Add File item
                                </Button>
                              </div>

                              {/* Add caption item */}

                              <div style={{ margin: "20px 0" }}>
                                {captionFields.map((field, index) => (
                                  <CustomCaptionFields
                                    key={index}
                                    name={field}
                                    value={field}
                                    onChange={(e) =>
                                      handleCaptionItemChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    onDelete={() =>
                                      handleCaptionDeleteItem(index)
                                    }
                                  />
                                ))}

                                <Button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  type="dashed"
                                  onClick={handleAddCaptionItem}
                                  icon={<PlusOutlined />}
                                >
                                  Add Caption item
                                </Button>
                              </div>

                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                                <button type="submit" class="btn btn-primary">
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

export default Templates;
