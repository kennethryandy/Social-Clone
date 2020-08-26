import React from 'react'
//Material ui
import Card from '@material-ui/core/Card'
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

const SideProfileSkeleton = () => {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <Skeleton className={classes.skeletons} variant="circle" width={240} height={240} />
      <Skeleton className={classes.skeletons} variant="text" width="80%"/>
      <CardContent>
        <Skeleton className={classes.skeletons} variant="text" width="60%"/>
        <Skeleton className={classes.skeletons} variant="text" width="60%"/>
        <Skeleton className={classes.skeletons} variant="text" width="60%"/>
      </CardContent>
    </Card>
  )
}

export default SideProfileSkeleton
