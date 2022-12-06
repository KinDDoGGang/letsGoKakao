import React, { useState } from "react";
import { getToday } from "../../utils/utils";
import { TextField } from "@mui/material";

export default function CustomDatePicker({
  callback,
  wantDateRef,
  isLocationed,
}) {
  const [date, setDate] = useState(getToday());

  const handleChange = (event) => {
    setDate(event.target.value);
    typeof callback == "function" && callback(event.target.value);
  };

  return (
    <form noValidate>
      <TextField
        id="date"
        type="date"
        defaultValue={getToday()}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
        value={
          Object.keys(isLocationed).length > 0
            ? isLocationed["totList"]["data"]["date"]
            : date
        }
        inputRef={wantDateRef}
        disabled={Object.keys(isLocationed).length > 0}
      />
    </form>
  );
}
