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
import { storage } from '../../firebase';

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

    const [values, setValues] = useState(initialValue)
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [editPage, setEditPage] = useState(false)

    // console.log("Looooo", values);

    useEffect(() => {
        if (location.pathname?.includes('edit')) {
            setEditPage(true)

            let dataEdit = JSON.parse(localStorage.getItem('contactList'))  
            setValues(dataEdit[0])
            console.log("REACHED >>>", id, dataEdit)
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
        let { userName, phone, type, isWhatsApp } = values
        let url = await handleUpload()
        let payload = {
            userName, image: url, phone, type, isWhatsApp
        }
        let initialList = JSON.parse(localStorage.getItem('contactList')) || []
        let updatedList = [...initialList, payload]
        localStorage.setItem("contactList", JSON.stringify(updatedList));
        setLoader(false)
        setValues(initialValue)
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
            <Paper elevation={12} style={{ padding: '20px', marginTop: '20px'}} >
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

                <input
                    type="file"
                    onChange={handleChangeFile}
                />

                <Button variant="contained" disabled={!file || (!validatePhoneNumber(values.phone))} onClick={() => addContact()}>Submit</Button>

                {loader && <CircularProgress />}

            </Paper>
        </Box>
    )
}
