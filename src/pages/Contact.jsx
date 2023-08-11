import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table } from "antd";
import { Box, Grid, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";

const Contact = () => {
  const [data, setData] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState([]);
  const [selectedCustomField, setSelectedCustomField] = useState([]);
  const [editContactId, setEditContactId] = useState(null);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    whatsappMobile: "",
    mobile: "",
  });

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  const handleEditContact = (_id) => {
    const selectedContact = data.find((contact) => contact._id === _id);

    if (selectedContact) {
      setEditContactId(_id); // Set the ID of the contact being edited
      setContact({
        name: selectedContact.name,
        email: selectedContact.email,
        whatsappMobile: selectedContact.whatsappMobile,
        mobile: selectedContact.mobile,
      }); // Populate the form fields with the selected contact data
    }

    console.log(`Editing contact with ID: ${_id}`);
  };

  const handleDeleteContact = (_id) => {
    // Delete contact with the given ID
    axios
      .delete(`http://localhost:7000/api/contact/delete/${_id}`)
      .then((res) => {
        toast.success("Contact deleted successfully!");
        fetchData();
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/contact/get");

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeContact = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value,
    });
  };
  //************************main code**********************
  const handleCustomFieldSelect = (e, index) => {
    const { value } = e.target;

    setSelectedCustomField((prevState) => {
      // Ensure the index exists in the state or add a new entry
      const newState =
        prevState.length > index ? [...prevState] : [...prevState, ""];

      newState[index] = value;
      console.log(newState);
      return newState;
    });
  };
  //************************main code**********************
  //************************new code**********************

  //************************new code**********************

  //************************main code**********************
  const handleCustomFieldChange = (e, index) => {
    const { name, value } = e.target;

    setCustomFieldValues((prevState) => {
      // Ensure the index exists in the state or add a new entry
      const newInputValue =
        prevState.length > index ? [...prevState] : [...prevState, {}];

      newInputValue[index] = {
        ...newInputValue[index],
        [name]: value,
      };
      return newInputValue;
    });
  };
  //************************main code**********************

  //************************new code**********************

  //************************new code**********************

  const handleModalSave = () => {
    if (
      contact.name.trim() === "" ||
      contact.email.trim() === "" ||
      contact.whatsappMobile.trim() === "" ||
      contact.mobile.trim() === ""
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }

    // ****************main code***********************
    // Prepare the custom fields data as an array of objects
    const customFieldsData = customFields.map((field, index) => ({
      title: field.title,
      value: customFieldValues[index]
        ? customFieldValues[index][field.title] || ""
        : "",
    }));

    // Combine the contact data with the custom field data
    const allData = {
      ...contact,
      CustomFields: customFieldsData,
    };

    if (editContactId) {
      // Perform update logic
      axios
        .put(
          `http://localhost:7000/api/contact/update/${editContactId}`,
          allData
        )
        .then((res) => {
          toast.success("Contact updated successfully!");
          fetchData();
          setContact({
            name: "",
            email: "",
            whatsappMobile: "",
            mobile: "",
          });
          setCustomFieldValues({});
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    } else {
      axios
        .post("http://localhost:7000/api/contact/add", allData)
        .then((res) => {
          toast.success("Contact added successfully!");
          fetchData();
          setContact({
            name: "",
            email: "",
            whatsappMobile: "",
            mobile: "",
          });
          setCustomFieldValues({});
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    }
  };

  const isFormValid =
    contact.name.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.whatsappMobile.trim() !== "" &&
    contact.mobile.trim() !== "";

  const columns = [
    {
      title: "ID",
      key: "id",
      fixed: "left",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },

    ...customFields.map((field) => ({
      title: field.title,
      dataIndex: "CustomFields",
      key: field.title,
      ellipsis: true,
      render: (customFields, record) => {
        const value = customFields ? customFields[field.title] : "NA";
        // const value =
        //   customFields.find((item) => item.title === field.title)?.value ||
        //   "NA";
        return <span>{value}</span>;
      },
    })),

    {
      title: "WhatsApp Number",
      dataIndex: "whatsappMobile",
      key: "whatsappMobile",
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      ellipsis: true,
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
            onClick={() => handleEditContact(record._id)}
          >
            <i class="ri-pencil-fill"></i>
          </button>

          <button
            onClick={() => handleDeleteContact(record._id)}
            className="delete-btn"
          >
            <i class="ri-delete-bin-fill"></i>
          </button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:7000/api/contact/customfield")
      .then((res) => {
        setCustomFields(res.data);
      })
      .catch((err) => {
        console.error("Error fetching custom fields:", err);
      });
  }, []);

  return (
    <div class="page-content w-100">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 class="mb-sm-0 py-3">Contact</h4>
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
                      <i class="ri-add-fill me-1 align-bottom"></i> Add Contact
                    </button>
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                              {editContactId ? "Update Contact" : "Add Contact"}
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
                                label="Enter Name"
                                name="name"
                                value={contact.name}
                                onChange={handleChangeContact}
                                margin="normal"
                                required
                                autoFocus
                              />
                              <TextField
                                fullWidth
                                label="Enter Email"
                                name="email"
                                value={contact.email}
                                onChange={handleChangeContact}
                                margin="normal"
                                required
                                type="email"
                              />
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <TextField
                                    margin="normal"
                                    type="mobile"
                                    required
                                    fullWidth
                                    label="Whatsapp Number"
                                    name="whatsappMobile"
                                    value={contact.whatsappMobile}
                                    onChange={handleChangeContact}
                                    autoFocus
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    margin="normal"
                                    type="mobile"
                                    required
                                    fullWidth
                                    label="Phone"
                                    name="mobile"
                                    value={contact.mobile}
                                    onChange={handleChangeContact}
                                    autoComplete="mobile"
                                    autoFocus
                                  />
                                </Grid>
                              </Grid>
                              <div>
                                {/* ==========main code=========== */}

                                <Form
                                  name="dynamic_form_nest_item"
                                  onFinish={onFinish}
                                  style={{ maxWidth: 600 }}
                                  autoComplete="off"
                                >
                                  <Form.List name="users">
                                    {(fields, { add, remove }) => (
                                      <>
                                        {fields.map(
                                          (
                                            { key, name, ...restField },
                                            index
                                          ) => (
                                            <Space
                                              key={key}
                                              style={{
                                                display: "flex",
                                                marginBottom: 8,
                                              }}
                                              align="baseline"
                                            >
                                              <Form.Item>
                                                <select
                                                  className="form-select"
                                                  defaultValue={
                                                    selectedCustomField[index]
                                                  }
                                                  onChange={(e) =>
                                                    handleCustomFieldSelect(
                                                      e,
                                                      index
                                                    )
                                                  }
                                                >
                                                  <option value="">
                                                    Select Custom Field
                                                  </option>
                                                  {customFields.map((field) => (
                                                    <option
                                                      key={field._id}
                                                      value={field.title}
                                                    >
                                                      {field.title}
                                                    </option>
                                                  ))}
                                                </select>
                                              </Form.Item>

                                              {selectedCustomField[index] && (
                                                <Form.Item>
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    name={
                                                      selectedCustomField[index]
                                                    } // Pass the name as the selected custom field
                                                    value={
                                                      customFieldValues[index]
                                                        ? customFieldValues[
                                                            index
                                                          ][
                                                            selectedCustomField[
                                                              index
                                                            ]
                                                          ]
                                                        : ""
                                                    }
                                                    placeholder="value"
                                                    onChange={(e) =>
                                                      handleCustomFieldChange(
                                                        e,
                                                        index
                                                      )
                                                    }
                                                  />
                                                </Form.Item>
                                              )}

                                              <MinusCircleOutlined
                                                style={{
                                                  fontSize: "25px",
                                                  textAlign: "center",
                                                }}
                                                onClick={() => remove(name)}
                                              />
                                            </Space>
                                          )
                                        )}
                                        <Form.Item>
                                          <Button
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                          >
                                            Add field
                                          </Button>
                                        </Form.Item>
                                      </>
                                    )}
                                  </Form.List>
                                </Form>

                                {/* ==========main code=========== */}

                                {/* ==========new code=========== */}

                                {/* ==========new code=========== */}
                              </div>
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
                              disabled={!isFormValid}
                            >
                              {editContactId ? "Update Contact" : "Add Contact"}
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

export default Contact;
