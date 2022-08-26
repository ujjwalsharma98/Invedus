import React, { useEffect, useState } from "react"
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

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
    const [selectedId, setSelectedId] = useState(null)
    const [deletionModal, setDeletionModal] = useState(false)

    useEffect(() => {
        getUpdatedList()
    }, [])

    const getUpdatedList = () => {
        let list = JSON.parse(localStorage.getItem('contactList'))
        let mappedList = list?.map(contact => ({ ...contact, isWhatsApp: contact.isWhatsApp ? 'Yes' : 'No', type: contact.type == 1 ? 'Personal' : 'Office' })) || []
        setContactList(list)
        setMappedList(mappedList)
    }

    const deleteConfirmed = () => {
        let filteredArray = contactList.filter(item => item.id != selectedId)
        localStorage.setItem("contactList", JSON.stringify(filteredArray));
        setDeletionModal(false)
        getUpdatedList()
    }

    const deleteItem = (id) => {
        setSelectedId(id)
        setDeletionModal(true)
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

            <Modal
                open={deletionModal}
                onClose={() => setDeletionModal(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">Do you want to delete this this?</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-around'}}>
                        <Button variant="contained" onClick={() => deleteConfirmed()}>Yes</Button>
                        <Button variant="contained" onClick={() => setDeletionModal(false)}>No</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
