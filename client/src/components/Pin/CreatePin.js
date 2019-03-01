import React, { useState, useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone'
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/SaveTwoTone'

import { CREATE_PIN_MUTATION } from '../../graphql/mutations'
import { useClient } from '../../client'

import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Context from '../../context'

const CreatePin = ({ classes }) => {
  const mobile = useMediaQuery('(max-width: 650px)')
  const client = useClient()
  const { state, dispatch } = useContext(Context)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleImageUpload = async () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'geopins')
    data.append('cloud_name', 'djsnadzwm')
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/djsnadzwm/image/upload',
      data
    )
    return response.data.url
  }

  const handleDeleteDraft = () => {
    setTitle('')
    setImage('')
    setContent('')
    dispatch({ type: 'DELETE_DRAFT' })
  }
  const handleSumbit = async event => {
    try {
      event.preventDefault()
      setSubmitting(true)

      const url = await handleImageUpload()
      const { latitude, longitude } = state.draft
      const variables = { title, image: url, content, latitude, longitude }
      await client.request(CREATE_PIN_MUTATION, variables)

      handleDeleteDraft()
    } catch (err) {
      setSubmitting(false)
      console.error('error creating pin', err)
    }
  }

  return (
    <form className={classes.form}>
      <Typography className={classes.alignCenter} component="h2" color="secondary" variant="h4">
        <LandscapeIcon className={classes.iconLarge} />
        Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="title"
          placeholder="Insert Pin Title"
          // value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image && 'green' }}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows={mobile ? '3' : '6'}
          margin="normal"
          fullWidth
          variant="outlined"
          // value={content}

          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Delete Pin
        </Button>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSumbit}
        >
          <SaveIcon className={classes.rightIcon} />
          Submit
        </Button>
      </div>
    </form>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
  },
  input: {
    display: 'none',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
})

export default withStyles(styles)(CreatePin)
