import React from 'react'
//Redux
import { useSelector } from 'react-redux'
import ProfileSkeleton from '../layout/Skeletons/ProfileSkeleton'
import ProfilePage from './ProfilePage'
import { Redirect } from 'react-router-dom'

const Profiles = ({match}) => {
  const state = useSelector(state => state.user)

  return (
    state?.authenticated ? (
      !state?.loading ? (
        <ProfilePage id={match.params?.id} />
      ) : (
        <ProfileSkeleton/>
      )
    ): (
      <Redirect to='/login'/>
    )
  )
}

export default Profiles
