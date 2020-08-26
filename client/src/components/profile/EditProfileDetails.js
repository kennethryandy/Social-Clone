import React,{useState} from 'react'
//Redux
import {editUserDetails} from '../../redux/actions/userActions'
import {useDispatch} from 'react-redux'
//Material ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const EditProfileDetails = ({open, setOpen}) => {
  const dispatch = useDispatch()
  const [detailInput, setDetailInput] = useState({
    bio: '',
    location: '',
    status: ''
  })

  const handleChange = e => {
    const {name, value} = e.target
    setDetailInput(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleSubmit = () => {
    if(detailInput.bio.trim() === '' && detailInput.location.trim() === '' && detailInput.status.trim() === ''){
      setOpen(false)
      setDetailInput({
        bio: '',
        location: '',
        status: ''
      })
      return
    }else{
      dispatch(editUserDetails(detailInput))
      setOpen(false)
      setDetailInput({
        bio: '',
        location: '',
        status: ''
      })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle >Edit Profile Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="bio"
            label="Bio"
            type="text"
            fullWidth
            placeholder="Enter your bio.."
            multiline
            rows={3}
            value={detailInput.bio}
            onChange={e => handleChange(e)}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={detailInput.location}
            onChange={e => handleChange(e)}
          />
          <TextField
            margin="dense"
            name="status"
            label="Relationship Status"
            type="text"
            fullWidth
            value={detailInput.status}
            onChange={e => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}  color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default EditProfileDetails
