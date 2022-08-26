import React, { useEffect, useState } from "react"
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'image',
            headerName: 'Image',
            width: 90,
            renderCell: (params) => {
                return (
                    <div>
                        <img src={params?.row?.image} width={30} height={30} alt='no image' />
                    </div>
                )
            }
        },
        { field: 'userName', headerName: 'Name', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 150, type: 'number', },
        {
            field: 'type',
            headerName: 'Type',
            width: 90,
        },
        {
            field: 'isWhatsApp',
            headerName: 'Whatsapp',
            width: 90,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <EditIcon onClick={() => navigate(`/edit-contact/${params?.row?.id}`)} />
                        <DeleteIcon onClick={() => deleteItem(params?.row?.id)} />
                    </div>
                )
            }
        },
    ];

    const [contactList, setContactList] = useState([])
    const [mappedList, setMappedList] = useState([])

    useEffect(() => {
        getUpdatedList()
    }, [])

    const getUpdatedList = () => {
        let list = JSON.parse(localStorage.getItem('contactList'))
        let mappedList = list?.map(contact => ({ ...contact, isWhatsApp: contact.isWhatsApp ? 'Yes' : 'No', type: contact.type == 1 ? 'Personal' : 'Office' })) || []
        setContactList(list)
        setMappedList(mappedList)
    }

    console.log({ contactList })

    const deleteItem = (id) => {
        let filteredArray = contactList.filter(item => item.id != id)
        localStorage.setItem("contactList", JSON.stringify(filteredArray));
        getUpdatedList()
    }

    return (
        <div style={{ height: 400, width: 800 }}>

            <div>
                <Button variant="contained" onClick={() => navigate(`/add-contact`)}>Add Contact</Button>
            </div>

            <DataGrid
                rows={mappedList}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
        </div>
    )
}
