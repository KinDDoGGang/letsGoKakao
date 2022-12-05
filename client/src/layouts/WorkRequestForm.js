import React, { useState, useEffect } from 'react';
import {useOutletContext } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CustomDropdownList from '../components/CustomDropdownList/CustomDropdownList';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomLogout from '../components/CustomLogout/CustomLogout';


import AddressForm from '../layouts/AddresForm';

/** TODO 시간되면 상단에 로그인한 사용자명 표시해줘도 좋을 듯, 로그아웃버튼 추가하고 */


/* step 밑에 dropdownbox 추가 */
const permissionSteps = ['승인 요청', '처리 중', '처리 완료'];
const firewallSteps = ['승인 요청', '정책 검토', '방화벽 설정', '설정 완료'];

function getStepContent(step) {
  switch (step) {
    case 0:
       return <AddressForm />;
    case 1:
    //   return <PaymentForm />;
    case 2:
    //   return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();



export default function WorkRequestForm () {
    const callbackTemplate = (callbackTemplate) => {
        console.log('callbackTemplate >> ',callbackTemplate);
        setSelectedTemplate(callbackTemplate);
    }

    const callbackUser = (callbackUser) => {
        console.log('callbackUSer', callbackUser);
        setSelectedUser(callbackUser);
    }

    const [activeStep, setActiveStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState('1');
    const [selectedUser, setSelectedUser] = useState('1');

    const { templateList, userList } = useOutletContext();

    useEffect(
         () => {
            console.log('요청하기 페이지 load...');
    }, []);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
            position="absolute"
            color="default"
            elevation={0}
            sx={{
                position: 'relative',
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
        >
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap >
            홈 이미지 / 요청 하기 <CustomLogout />
            </Typography>
            </Toolbar>
        </AppBar>
        
        <Container component="main" sx={{ mb: 15 }} style={{ float:'left' }}>
            <Grid container spacing={3}>
                <Paper variant="outlined" sx={{ my: { xs: 2, md: 5 }, p: { xs: 2, md: 3 } }} >
                <Typography variant="h5" color="inherit" noWrap >요청양식</Typography>
                <CustomDropdownList 
                    fullWidth
                    TemplateList={templateList}
                    placeText={'요청 양식을 선택해주세요'}
                    mSize={1}
                    callback={callbackTemplate}
                /> 
                <br></br>
                <Typography variant="h5" color="inherit" noWrap >요청제목</Typography>
                <CustomInput 
                    fullWidth
                />
                <br></br>
                <Typography variant="h5" color="inherit" noWrap >담당자 설정</Typography>
                {
                Number(selectedTemplate || '1') === 1 ?
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {permissionSteps.map( (label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <br></br>
                            {
                                index !== permissionSteps.length-1 && 
                                <CustomDropdownList size={150} TemplateList={userList} placeText={'담당자 선택'} mSize={0} callback={callbackUser} /> 
                            }
                        </Step>
                        ))}
                    </Stepper>
                :
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {firewallSteps.map( (label, index) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    { 
                        index !== firewallSteps.length-1 && <CustomDropdownList size={150} TemplateList={userList} placeText={'담당자 선택'} mSize={0} callback={callbackUser} /> }
                </Step>
                ))}
            </Stepper>
                }
                {/* 마지막 단계 */}
                {activeStep === permissionSteps.length ? (
                    <>
                    <Typography variant="h5" gutterBottom>
                        Thank you for your order.
                    </Typography>
                    <Typography variant="subtitle1">
                        Your order number is #2001539. We have emailed your order
                        confirmation, and will send you an update when your order has
                        shipped.
                    </Typography>
                    </>
                ) : (
                    <>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                            Back
                        </Button>
                        )}

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 3, ml: 1 }}
                        >
                        {activeStep === permissionSteps.length - 1 ? 'Place order' : 'Next'}
                        </Button>
                    </Box>
                    </>
                )}
                </Paper>
            </Grid>
        </Container>
    </ThemeProvider>
  );
}