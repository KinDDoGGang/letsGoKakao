import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function CustomInput({fullWidth}) {
    return(
        <Box
            component="form"
            sx={{
            '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField id="outlined-basic" label="제목을 입력하세요" variant="outlined"/>
      </Box>
    )
}