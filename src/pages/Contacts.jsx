import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table } from "antd";
import { Grid, TextField } from "@mui/material";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Button } from "antd";

const Contacts = () => {
  const [data, setData] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [nextCustomFieldType, setNextCustomFieldType] = useState("");
  const [customsData, setCustomsData] = useState([]);
  const [editContactId, setEditContactId] = useState(null);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    whatsappMobile: "",
    mobile: "",
    personalisedattachment: "",
  });

  const handleEditContact = (_id) => {
    const selectedContact = data.find((contact) => contact._id === _id);

    if (selectedContact) {
      setEditContactId(_id); // Set the ID of the contact being edited
      setContact({
        name: selectedContact.name,
        email: selectedContact.email,
        whatsappMobile: selectedContact.whatsappMobile,
        mobile: selectedContact.mobile,
        personalisedattachment: selectedContact.personalisedattachment,
      }); // Populate the form fields with the selected contact data
      setCustomFields(
        selectedContact.customFields.map((field) => ({
          title: field.title,
          value: field.value,
        }))
      );
    }

    console.log(`Editing contact with ID: ${_id}`);
  };

  // Fetch customs data on component mount
  useEffect(() => {
    fetchCustomsData();
  }, []);

  const fetchCustomsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/contact/customfield"
      );
      setCustomsData(response.data);
    } catch (error) {
      console.error("Error fetching customs data:", error);
    }
  };

  // Fetch Contact data on component mount
  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/contact/get");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching customs data:", error);
    }
  };

  // main code

  // const onSubmit = async (data) => {
  //   try {
  //     const formData = {
  //       ...data,
  //       customFields: customFields.filter((field) => field.value.trim() !== ""),
  //     };

  //     // Send the complete form data to the backend API to save to the database
  //     await axios.post("http://localhost:7000/api/contact/add", formData);
  //     fetchContactData();
  //     toast.success("Contact Added Successfully!");

  //     // Perform any other action you want after successful submission
  //     reset();
  //     setCustomFields([]); // Clear custom fields after form submission
  //   } catch (error) {
  //     console.error("Error submitting contact data:", error);
  //   }
  // };

  // main code

  const handleChangeContact = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value,
    });
  };

  // experimental code
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...contact,
        customFields: customFields.filter((field) => field.value.trim() !== ""),
      };

      if (editContactId) {
        // Perform update logic
        await axios
          .put(
            `http://localhost:7000/api/contact/update/${editContactId}`,
            formData
          )
          .then((res) => {
            toast.success("Contact updated successfully!");
            fetchContactData();
            setContact({
              name: "",
              email: "",
              whatsappMobile: "",
              mobile: "",
              personalisedattachment: "",
            });
            setCustomFields([]);
          })
          .catch((error) => {
            toast.error("Something went wrong!");
          });
      } else {
        // Send the complete form data to the backend API to save to the database
        await axios.post("http://localhost:7000/api/contact/add", formData);
        fetchContactData();
        toast.success("Contact Added Successfully!");

        // Perform any other action you want after successful submission
        // reset();
        setContact({
          name: "",
          email: "",
          whatsappMobile: "",
          mobile: "",
          personalisedattachment: "",
        });
        setCustomFields([]);
      }
    } catch (error) {
      console.error("Error submitting contact data:", error);
    }
  };
  // experimental code

  const handleAddCustomField = () => {
    const selectedCustom = customsData.find(
      (custom) => custom.title === nextCustomFieldType
    );

    if (selectedCustom) {
      setCustomFields([
        ...customFields,
        { title: selectedCustom.title, value: "" },
      ]);
      setNextCustomFieldType(""); // Reset the next custom field type
    }
  };

  const handleCustomFieldValueChange = (index, event) => {
    const updatedFields = [...customFields];
    updatedFields[index].value = event.target.value;
    setCustomFields(updatedFields);
  };

  const handleRemoveCustomField = (index) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const handleDeleteContact = (_id) => {
    // Delete contact with the given ID
    axios
      .delete(`http://localhost:7000/api/contact/delete/${_id}`)
      .then((res) => {
        toast.success("Contact deleted successfully!");
        fetchContactData();
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };

  // Function to generate dynamic columns for custom fields
  const generateCustomFieldColumns = () => {
    return customsData.map((field) => ({
      title: field.title,
      dataIndex: `${field.title}`,
      key: `${field.title}`,
      ellipsis: true,
    }));
  };

  // Function to map custom fields data to match the dynamic columns
  const mapCustomFieldsData = (contact) => {
    const customFieldsData = {};
    customsData.forEach((field) => {
      const customField = contact.customFields.find(
        (cf) => cf.title === field.title
      );
      customFieldsData[`${field.title}`] = customField
        ? customField.value
        : "NA";
    });
    console.log(customFieldsData);
    return { ...contact, ...customFieldsData };
  };

  // Generate dynamic columns for custom fields
  const customFieldColumns = generateCustomFieldColumns();

  // Map data to include custom fields as columns
  const mappedData = data.map(mapCustomFieldsData);

  const columns = [
    // {
    //   title: "ID",
    //   key: "id",
    //   fixed: "left",
    //   width: 50,
    //   render: (text, record, index) => index + 1,
    // },
    {
      title: "Action",
      fixed: "left",
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
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },

    ...customFieldColumns.map((column) => ({
      ...column,
      render: (text) => {
        // Check if the value is "NA" and apply custom styling if needed
        if (text === "NA") {
          return <span style={{ color: "red" }}>{text}</span>;
        }
        return text;
      },
    })),
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },

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
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const deleteButtonStyle = {
    display: hasSelected ? "block" : "none",
  };

  return (
    <div class="page-content w-100">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h3 class="mb-sm-0 py-3">Contact</h3>
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
                    <Button
                      danger
                      type="primary"
                      onClick={start}
                      // disabled={!hasSelected}
                      style={deleteButtonStyle}
                      loading={loading}
                    >
                      Delete selected Items
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                      {hasSelected
                        ? `Selected ${selectedRowKeys.length} items`
                        : ""}
                    </span>
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
                            {/* Here You can create the form */}
                            <form onSubmit={handleSubmit}>
                              <div>
                                <TextField
                                  color="primary"
                                  size="small"
                                  fullWidth
                                  label="Enter Name"
                                  name="name"
                                  value={contact.name}
                                  onChange={handleChangeContact}
                                  margin="normal"
                                  type="text"
                                  // {...register("name", { required: true })}
                                  required
                                  autoFocus
                                />
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  fullWidth
                                  label="Enter Email"
                                  name="email"
                                  value={contact.email}
                                  onChange={handleChangeContact}
                                  margin="normal"
                                  type="email"
                                  // {...register("email", { required: true })}
                                  required
                                />
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  fullWidth
                                  margin="normal"
                                  label="Whatsapp Number"
                                  name="whatsappMobile"
                                  value={contact.whatsappMobile}
                                  onChange={handleChangeContact}
                                  type="tel"
                                  // {...register("whatsappMobile", {
                                  //   required: true,
                                  // })}
                                  required
                                  autoFocus
                                />
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  margin="normal"
                                  required
                                  fullWidth
                                  label="Phone"
                                  name="mobile"
                                  value={contact.mobile}
                                  onChange={handleChangeContact}
                                  type="tel"
                                  // {...register("mobile", { required: true })}
                                  autoComplete="mobile"
                                  autoFocus
                                />
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  margin="normal"
                                  fullWidth
                                  label="Personalised Attachement"
                                  name="personalisedattachment"
                                  value={contact.personalisedattachment}
                                  onChange={handleChangeContact}
                                  autoComplete="personalisedattachment"
                                  autoFocus
                                />
                              </div>
                              <div>
                                {customFields.map((field, index) => (
                                  <div key={index}>
                                    <Grid
                                      container
                                      spacing={1}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Grid item xs={11}>
                                        <TextField
                                          size="small"
                                          fullWidth
                                          label={`${field.title}`}
                                          type="text"
                                          margin="normal"
                                          value={field.value}
                                          onChange={(e) =>
                                            handleCustomFieldValueChange(
                                              index,
                                              e
                                            )
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={1}>
                                        <MinusCircleOutlined
                                          style={{
                                            fontSize: "25px",
                                            textAlign: "center",
                                          }}
                                          onClick={() =>
                                            handleRemoveCustomField(index)
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </div>
                                ))}

                                <Grid
                                  container
                                  spacing={1}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    marginBottom: "20px",
                                  }}
                                >
                                  <Grid item xs={9}>
                                    <select
                                      className="form-select"
                                      margin="normal"
                                      value={nextCustomFieldType}
                                      onChange={(e) =>
                                        setNextCustomFieldType(e.target.value)
                                      }
                                    >
                                      <option value="">
                                        Select a Custom Field
                                      </option>
                                      {customsData.map((custom) => (
                                        <option
                                          key={custom._id}
                                          value={custom.title}
                                        >
                                          {custom.title}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Button
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      type="dashed"
                                      onClick={handleAddCustomField}
                                      icon={<PlusOutlined />}
                                    >
                                      Add field
                                    </Button>
                                  </Grid>
                                </Grid>
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
                                  {editContactId
                                    ? "Update Contact"
                                    : "Add Contact"}
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
                  rowSelection={rowSelection}
                  dataSource={mappedData}
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

export default Contacts;
