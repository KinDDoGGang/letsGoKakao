import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CustomDropdownList from '../components/CustomDropdownList/CustomDropdownList';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function AddressForm() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        요청 내용
      </Typography>
      <br></br>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={13}>
        <Typography variant="h6" gutterBottom>부여대상 사용자</Typography>
          <CustomDropdownList 
            fullWidth 
            TemplateList={[]}
            placeText={''}
            mSize={1}
          />
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>요청 내용 상세</Typography>
          <CKEditor
              style={{  margin: '10px'}}
              editor={ClassicEditor}
              data="<p>요청내용을 입력하세요</p>"
              onReady={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor);
              }}
          />
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>처리 희망일</Typography>
          <CustomDatePicker />
        </Grid>
      </Grid>
    </>
  );
}