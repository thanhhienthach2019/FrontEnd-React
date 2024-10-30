import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IAuthDto } from '../../interfaces/IAuthDto'
import { WithNetworkProps } from '../../interfaces/WithNetworkProps'
import { registration } from '../../store/action-creators/AuthActionCreators'
import { authActions } from '../../store/reducers/AuthReducer'
import withNetwork from '../hocs/withNetwork'

const Registration: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()

    const reg = (): void => {
        const authDto: IAuthDto = {
            Email: login,
            Password: password,            
        }
        dispatch(registration(authDto))
    }

    useEffect(() => {
        if (authState.isAuth) {
            navigate('/login')
        }
    }, [navigate, authState.isAuth])

    return (
        <>
            <h1>Registration</h1>
            <div>
                <label htmlFor="login">Username</label>
                <input className="login" type="text" onChange={(e) => setLogin(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input className="password" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            {authState.error && <div>{authState.error as string}</div>}
            <div>
                <button onClick={reg}>Register</button>
                <button
                    onClick={() => {
                        navigate('/login')
                        dispatch(authActions.clearError())
                    }}
                >
                    У I already have an account
                </button>
            </div>
        </>
    )
}

export default withNetwork(Registration)
