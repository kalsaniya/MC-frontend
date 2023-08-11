import React from "react";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Grid, TextField } from "@mui/material";
const CustomCaptionFields = ({ name, value, onChange, onDelete }) => {
  return (
    <div className="custom-field">
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
            label="Add Text Item"
            type="text"
            margin="normal"
            name={name}
            value={value}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={1}>
          <MinusCircleOutlined
            style={{
              fontSize: "25px",
              textAlign: "center",
            }}
            onClick={onDelete}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomCaptionFields;
