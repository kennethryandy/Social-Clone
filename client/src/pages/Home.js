import React,{useEffect} from 'react'
//redux
import {useDispatch, useSelector} from 'react-redux'
import {getAllPosts} from '../redux/actions/dataActions'
//COMPONENTS
import Posts from '../components/post/Posts'
import SideProfile from '../components/profile/SideProfile'
import CreatePost from '../components/post/CreatePost'
//SKELETON COMPONENTS
import SideProfileSkeleton from '../components/layout/Skeletons/SideProfileSkeleton'
//MATERIAL UI
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import {makeStyles} from '@material-ui/core/styles'
import PostsSkeleton from '../components/layout/Skeletons/PostsSkeleton'


const useStyles = makeStyles(theme => ({
  wrapper:{
    marginTop: '1rem',
    height: '100vh',
  },
}))

const Home = () => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.data)
  const classes = useStyles()
  const {posts, loading} = data
  useEffect(() => {
    dispatch(getAllPosts())
  // eslint-disable-next-line
  },[])
  return (
    <Grid container>
      <Hidden xsDown>
        <Grid item sm={4}>
          <div className={classes.wrapper}>
            {!loading ? <SideProfile /> : <SideProfileSkeleton />}
          </div>
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={8}>
      <div className={classes.wrapper}>
        {!loading ? (
        <>
        <CreatePost/>
        {posts?.map(post => <Posts key={post._id} post={post} />)}
        </> ):
        <PostsSkeleton/>
      }
      </div>
      </Grid>
    </Grid>
  )
}

export default Home
