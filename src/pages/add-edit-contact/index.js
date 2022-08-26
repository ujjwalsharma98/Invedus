import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import validator from 'validator'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { v4 as uuidV4 } from 'uuid';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { storage } from '../../firebase';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let initialValue = {
    userName: '',
    image: '',
    phone: null,
    type: 1,
    isWhatsApp: false
}

export const Contact = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    let uniqId = uuidV4()

    const [values, setValues] = useState(initialValue)
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [editPage, setEditPage] = useState(false)
    const [openToaster, setOpenToaster] = React.useState(false);

    useEffect(() => {
        if (location.pathname?.includes('edit')) {
            setEditPage(true)
            let dataEdit = JSON.parse(localStorage.getItem('contactList'))?.filter(item => item.id == id)[0]
            setValues(dataEdit)
        }
    }, [])

    const handleChange = (e) => {
        let { name, value, checked } = e.target

        if (name == 'type') {
            setValues({
                ...values,
                [name]: value
            })
        } if (name == 'isWhatsApp') {
            setValues({
                ...values,
                [name]: checked
            })
        } else {
            setValues({
                ...values,
                [name]: value
            })
        }
    }

    const validatePhoneNumber = (number) => {
        if (number != null) {
            const isValidPhoneNumber = validator.isMobilePhone(number)
            return (isValidPhoneNumber)
        }
    }

    const addContact = async () => {
        setLoader(true)
        if (editPage) {
            let { userName, phone, type, isWhatsApp } = values
            let filteredItemToBeUsed = JSON.parse(localStorage.getItem('contactList'))?.filter(item => item.id != id)
            let removedItem = JSON.parse(localStorage.getItem('contactList'))?.filter(item => item.id != id)[0]
            let payload = {
                userName, phone, type, isWhatsApp, id, image: removedItem?.image
            }
            filteredItemToBeUsed.push(payload)
            localStorage.setItem("contactList", JSON.stringify(filteredItemToBeUsed));
        } if (!editPage) {
            let { userName, phone, type, isWhatsApp } = values
            let url = await handleUpload()
            let payload = {
                userName, image: url, phone, type, isWhatsApp, id: uniqId
            }
            let initialList = JSON.parse(localStorage.getItem('contactList')) || []
            let updatedList = [...initialList, payload]
            localStorage.setItem("contactList", JSON.stringify(updatedList));
        }
        setLoader(false)
        setValues(initialValue)
        openAlert()
        navigate(`/`)
    }

    function handleChangeFile(e) {
        if (e.target.files[0])
            setFile(e.target.files[0]);
    }

    async function handleUpload(e) {
        const path = `/images/${file.name}`;
        const ref = storage.ref(path);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        setFile(null);
        return url
    }

    const openAlert = () => {
        setOpenToaster(true)
    }

    const closeAlert = () => {
        setOpenToaster(false)
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <Button variant="contained" onClick={() => navigate(`/`)}>Go Back</Button>
            </div>
            <Paper elevation={12} style={{ padding: '20px', marginTop: '20px' }} >
                <div>
                    <TextField
                        required
                        label="Name"
                        name='userName'
                        value={values.userName}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        label="Phone Number"
                        type="number"
                        name='phone'
                        helperText={(validatePhoneNumber(values.phone) || values.phone == null) ? '' : 'Invalid'}
                        id="outlined-error-helper-text"
                        error={(validatePhoneNumber(values.phone) || values.phone == null) ? false : true}
                        value={values.phone}
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <div>
                    <FormControl style={{ minWidth: 210 }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='type'
                            value={values.type}
                            label="Type"
                            onChange={(e) => handleChange(e)}
                        >
                            <MenuItem value={1}>personal</MenuItem>
                            <MenuItem value={2}>office</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        label="Available on whatsapp"
                        control={
                            <Checkbox
                                name='isWhatsApp'
                                value={values.isWhatsApp}
                                onChange={(e) => handleChange(e)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                    />
                </div>

                <div>
                    {!editPage && <input
                        type="file"
                        onChange={handleChangeFile}
                    />}
                    {editPage && <img src={values.image} width={200} height={200} alt='no image' />}
                    <Button variant="contained" disabled={(!editPage && !file) || (!validatePhoneNumber(values.phone))} onClick={() => addContact()}>{editPage ? 'Edit' : 'Submit'}</Button>
                </div>
                
                {loader && <CircularProgress />}

            </Paper>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openToaster} autoHideDuration={6000} onClose={() => closeAlert()}>
                    <Alert onClose={() => closeAlert()} severity="success" sx={{ width: '100%' }}>
                        {editPage ? 'Added Successfully!' : 'Updated Successfully!'}
                    </Alert>
                </Snackbar>
            </Stack>
        </Box>
    )
}
