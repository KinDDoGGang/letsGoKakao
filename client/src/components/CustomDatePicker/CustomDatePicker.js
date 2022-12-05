import React,{useState} from 'react'
import {getToday} from '../../utils/utils';
import { TextField } from "@mui/material";

export default function CustomDatePicker() {
    console.log('getToday >> ', getToday());
    return (
        <form noValidate>
            <TextField
                id="date"
                type="date"
                defaultValue={getToday()}
                InputLabelProps={{
                    shrink: true,
                }}
            />
      </form>
    )
}


	

