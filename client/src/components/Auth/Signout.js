import React, { useContext } from 'react'
import { GoogleLogout } from 'react-google-login'
import { withStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

import Context from '../../context'

import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

const Signout = ({ classes }) => {
  const mobile = useMediaQuery('(max-width: 650px)')
  const { dispatch } = useContext(Context)
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' })
  }

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography
            style={{ display: mobile ? 'none' : 'block' }}
            variant="body1"
            className={classes.buttonText}
          >
            Logout
          </Typography>
          <ExitToAppIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  )
}

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: 'orange',
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'orange',
  },
}

export default withStyles(styles)(Signout)
