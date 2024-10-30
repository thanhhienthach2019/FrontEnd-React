import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import { WithNetworkProps } from '../../interfaces/WithNetworkProps'
import { logout } from '../../store/action-creators/AuthActionCreators'
import { getAllUsers } from '../../store/action-creators/UserActionCreators'
import { userActions } from '../../store/reducers/UserReducer'
import withAuthorize from '../hocs/withAuthorize'
import withNetwork from '../hocs/withNetwork'

const AuthorizedUser: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {
    const userState = useAppSelector((state) => state.userReducer)
    const navigate = useNavigate()

    const [usersArray, setUsersArray] = useState<JSX.Element[] | undefined>([])
console.log(authState.isAuth);
    // useEffect(() => {
    //     if (!authState.isAuth) {
    //         navigate('/login')
    //     }
    // }, [authState.isAuth, navigate])

    useEffect(() => {
        if (userState.users) {
            const usrsArray: JSX.Element[] | undefined = userState.users?.map((item, index) => (
                <li key={item.id.toString()}>{item.email}</li>
            ))
            setUsersArray(usrsArray)
        }
    }, [userState.users])

    const signOut = () => {
        dispatch(logout())
        dispatch(userActions.clearUsers())
        dispatch(userActions.clearError())
    }

    return (
        <>
            <h3>User {authState.userData?.dataSend.userData.userDto.email} Authorized</h3>
            <div>
                <button onClick={() => dispatch(getAllUsers())}>Get all users</button>
                {userState.isLoading && <div>Loading users...</div>}
                {userState.users && <ul>{usersArray}</ul>}
            </div>
            {userState.error && <div>{userState.error as string}</div>}
            <div>
                <button onClick={signOut}>Exit</button>
            </div>
        </>
    )
}

export default withAuthorize(withNetwork(AuthorizedUser))
