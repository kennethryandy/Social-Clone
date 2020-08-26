import React from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Skeleton from '@material-ui/lab/Skeleton'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(3),
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 0,
  }
}))
const PostsSkeleton = () => {
  const classes = useStyles()
  return (
    <>
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Skeleton variant="circle" width={40} height={40}/>
        }
        title={
          <Skeleton width="80%"/>
        }
      />
    </Card>
    {[0,1].map((i) => (
      <Card className={classes.card} key={i}>
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
    ))}
    </>
  )
}

export default PostsSkeleton
