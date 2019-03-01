import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import FaceIcon from '@material-ui/icons/Face'

import CreateComment from '../Comment/CreateComment'
import Comments from '../Comment/Comments'
import Context from '../../context'

const PinContent = ({ classes }) => {
  const { state } = useContext(Context)
  const { title, content, author, createdAt, comments } = state.currentPin
  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography component="h3" variant="h6" color="inherit">
        <FaceIcon className={classes.icon} />
        {author.name}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <AccessTimeIcon className={classes.icon} />
        {createdAt}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {content}
      </Typography>
      {/* pin comments */}
      <CreateComment />
      <Comments comments={comments} />
    </div>
  )
}

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withStyles(styles)(PinContent)
