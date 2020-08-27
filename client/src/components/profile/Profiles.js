import React,{useEffect} from 'react'
import ProfilePage from './userProfile/ProfilePage'
import UsersProfiles from './usersProfiles/UsersProfiles'
//Redux
import {useDispatch, useSelector} from 'react-redux'
import {getUser} from '../../redux/actions/userActions'
import ProfileSkeleton from '../layout/Skeletons/ProfileSkeleton'

const Profiles = ({match}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const {id} = match.params
  useEffect(() => {
    if(id !== user?.credentials._id){
      dispatch(getUser(id))
    }
  // eslint-disable-next-line
  }, [])
  if(!user.loading ){
    if(id && user.credentials._id === id){
      return <ProfilePage/>
    }else{
      return <UsersProfiles/>
    }
  }else{
    return <ProfileSkeleton/>
  }
}

export default Profiles
