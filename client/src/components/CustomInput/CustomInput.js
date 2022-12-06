import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function CustomInput({
  fullWidth,
  inputRef,
  callback,
  isLocationed,
  placeText,
  flag
}) {
  const [txt, setTxt] = useState("");
  let locationedTxt = "";
  

  const handleChange = (event) => {
    setTxt(event.target.value);
    callback(event.target.value);
  };

  useEffect(() => {
      console.log('isLocationed in customInput >> ', isLocationed);
    
      if (Object.keys(isLocationed.state || {}).length > 0 &&  flag !== 'destination' && flag !== 'source') {
          locationedTxt = isLocationed.state.title;
      } else if (Object.keys(isLocationed).length > 0 &&  flag === 'destination') {
          locationedTxt = isLocationed.totList.data.destination;
      } else if (Object.keys(isLocationed).length > 0 && flag === 'source') {
          locationedTxt = isLocationed.totList.data.source;
      }
      setTxt(locationedTxt);
      callback(locationedTxt);
  }, []);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label={placeText}
        variant="outlined"
        inputRef={inputRef}
        onChange={handleChange}
        value={locationedTxt || txt}
        disabled={Object.keys(isLocationed.state || {}).length > 0 ||  ( (flag || '') !== '' && Object.keys(isLocationed).length > 0) }
      />
    </Box>
  );
}
