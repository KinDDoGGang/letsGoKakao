import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";

export default function CustomDropdownList({
  size
  ,TemplateList
  ,placeText
  ,mSize
  ,callback
  ,dropdownRef
  ,isDisabled=false
}) {
  const [template, setTemplate] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleChange = (event) => {
    setTemplate(event.target.value);
    callback(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }} width={size}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{placeText}</InputLabel>
        <Select
          inputRef={dropdownRef}
          value={template}
          label="select"
          onChange={handleChange}
          sx={{
            "& > :not(style)": { m: mSize },
          }}
          disabled={isDisabled}
        >
          {/* 현재 양식요청 Object, 사용자명 조회하는 string 타입으로 나뉘어짐 */}
          {(TemplateList || []).length > 0 && typeof TemplateList[0] == "object"
            ? (TemplateList || []).map((v, i) => {
                return (
                  <MenuItem value={ `${i + 1},${v.id}`} name={v.id}>
                    {v.label}
                  </MenuItem>
                );
              })
            : (TemplateList || []).map((v, i) => {
                return (
                  <MenuItem value={ `${i + 1},${v}` } name={v}>
                    {v}
                  </MenuItem>
                );
              })}
        </Select>
        <span></span>
      </FormControl>
    </Box>
  );
}
