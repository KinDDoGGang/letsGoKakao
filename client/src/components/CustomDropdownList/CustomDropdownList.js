import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

/* DROPDOWNLIST 컴포넌트 */
export default function CustomDropdownList({
    size,
    TemplateList,
    placeText,
    mSize,
    callback,
    dropdownRef,
    flag,
    isLocationed,
    reqType,
}) {
    const getTemplateData = () => {
        if ((flag || "") !== "" && Object.keys(isLocationed || {}).length > 0) {
            const locationedMap = isLocationed["totList"];

            switch (flag) {
                // 부여대상일 경우
                case "giveUser":
                    return locationedMap["data"]["targetUsername"];

                case "template":
                    return locationedMap["templateId"].includes("permission")
                        ? `1,${locationedMap["templateId"]}`
                        : `2,${locationedMap["templateId"]}`;

                case "assignee":
                    return locationedMap["steps"][0]["assignee"];

                case "operator":
                    return locationedMap["steps"][1]["assignee"];

                default:
                    return "";
            }
        }
    };

    const getFirewallData = () => {
        if ((flag || "") !== "" && Object.keys(isLocationed || {}).length > 0) {
            const locationedMap = isLocationed["totList"];

            switch (flag) {
                // 템플릿일 경우
                case "template":
                    return locationedMap["templateId"].includes("permission")
                        ? `1,${locationedMap["templateId"]}`
                        : `2,${locationedMap["templateId"]}`;

                case "approve":
                    return locationedMap["steps"][0]["assignee"];

                case "reviewer":
                    return locationedMap["steps"][1]["assignee"];

                case "firewall":
                    return locationedMap["steps"][2]["assignee"];

                default:
                    return "";
            }
        }
    };

    const [template, setTemplate] = useState("");

    /* dropdownList 데이터 선택 시 콜백 */
    const handleChange = (event) => {
        setTemplate(event.target.value);
        callback(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }} width={size}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                    {placeText}
                </InputLabel>
                <Select
                    inputRef={dropdownRef}
                    value={
                        reqType !== "firewall"
                            ? getTemplateData() || template
                            : getFirewallData() || template
                    }
                    label="select"
                    onChange={handleChange}
                    sx={{
                        "& > :not(style)": { m: mSize },
                    }}
                    disabled={
                        !!flag && Object.keys(isLocationed || {}).length > 0
                    }
                >
                    {/* 현재 양식요청 Object, 사용자명 조회하는 string 타입으로 나뉘어짐 */}
                    {(TemplateList || []).length > 0 &&
                    typeof TemplateList[0] == "object"
                        ? (TemplateList || []).map((v, i) => {
                              return (
                                  <MenuItem
                                      value={`${i + 1},${v.id}`}
                                      name={v.id}
                                  >
                                      {v.label}
                                  </MenuItem>
                              );
                          })
                        : (TemplateList || []).map((v, i) => {
                              return (
                                  <MenuItem value={`${i + 1},${v}`} name={v}>
                                      {v}
                                  </MenuItem>
                              );
                          })}
                </Select>
            </FormControl>
        </Box>
    );
}
