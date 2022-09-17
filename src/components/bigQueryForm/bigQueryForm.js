import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, IconButton, InputLabel } from "@mui/material";
import * as React from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";

export default function BigQueryForm({ onFieldChange }) {
  const [projectKey, setProjectKey] = useState({});
  const [fileName, setFileName] = useState("");

  const keyFileInput = useRef();
  const onBigQueryConnectionChange = (file) => {
    if (file) {
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        let temp = JSON.parse(e.target.result);
        setProjectKey(temp);
        setFileName(file.name);
      };
    } else {
      setProjectKey({});
      setFileName("");
    }
  };

  useEffect(() => {
    let flag = false;
    if (projectKey && Object.keys(projectKey).length !== 0) {
      flag = true;
    }
    onFieldChange(projectKey, flag);
  });
  return (
    <React.Fragment>
      <Grid
        item
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          textAlign: "left",
        }}
      >
        <InputLabel>Service Account Key File</InputLabel>
        <Grid
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} md={3} sm={3}>
            <Button variant="contained" fullWidth component="label">
              Upload
              <input
                ref={keyFileInput}
                type="file"
                hidden
                onChange={(e) => onBigQueryConnectionChange(e.target.files[0])}
              />
            </Button>
          </Grid>
          <Grid item xs={12} md={8} sm={8}>
            {fileName}
            {fileName && (
              <IconButton
                aria-label="Add"
                onClick={() => {
                  onBigQueryConnectionChange("");
                  keyFileInput.current.value = "";
                }}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
