import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import {makeStyles} from '@material-ui/core/styles'
//Lab
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: theme.spacing(3),
  },
  skeletons: {
    margin: `${theme.spacing(1)}px auto`
  }
}))

const ProfileSkeleton = () => {
  const classes = useStyles()
  return (
    <>
    <Card className={classes.card}>
      <Skeleton className={classes.skeletons} variant="circle" width={240} height={240} />
      <Skeleton className={classes.skeletons} variant="text" width="60%"/>
      <CardContent>
        <Skeleton className={classes.skeletons} variant="text" width="40%"/>
        <Skeleton className={classes.skeletons} variant="text" width="40%"/>
        <Skeleton className={classes.skeletons} variant="text" width="40%"/>
      </CardContent>
    </Card>
    <Card className={classes.card} style={{width: '70%', margin: '24px auto'}}>
      <CardHeader
        avatar={
          <Skeleton variant="circle" width={40} height={40}/>
        }
        title={
          <Skeleton width="80%"/>
        }
      />
    </Card>
    <Card className={classes.card} style={{width: '70%', margin: '24px auto'}}>
      <CardHeader
        avatar={
          <Skeleton variant="circle" width={40} height={40}/>
        }
        title={
          <Skeleton width="80%" style={{ marginBottom: 6 }} height="90%"/>
        }
        
        subheader={
          <Skeleton width="40%" height="60%"/>
        }
      />
      <CardContent>
        <Skeleton width="60%" style={{ marginBottom: 6 }} height="50%"/>
        <Skeleton width="60%" style={{ marginBottom: 6 }} height="50%"/>
        <Skeleton width="60%" style={{ marginBottom: 6 }} height="50%"/>
      </CardContent>
    </Card>
    </>
  )
}

export default ProfileSkeleton
