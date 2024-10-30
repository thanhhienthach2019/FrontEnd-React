import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IAuthDto } from '../../interfaces/IAuthDto'
import { WithNetworkProps } from '../../interfaces/WithNetworkProps'
import { signIn } from '../../store/action-creators/AuthActionCreators'
import { authActions } from '../../store/reducers/AuthReducer'
import withNetwork from '../hocs/withNetwork'

const Login: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()

    const log = (): void => {
        const authDto: IAuthDto = {
            Email: login,
            Password: password,            
        }

        // dispatch(signIn({ authDto, deviceFingerprint }));
    }

    useEffect(() => {
        if (authState.isAuth) {
            navigate('/authorized_user')
        }
    }, [navigate, authState.isAuth])

    return (
        <>
            <h1>Sign in</h1>
            <div>
                <label htmlFor="login">Username</label>
                <input type="text" onChange={(e) => setLogin(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            {authState.error && <div>{authState.error as string}</div>}
            <div>
                <button onClick={log}>Log in</button>
                <button
                    onClick={() => {
                        navigate('/')
                        dispatch(authActions.clearError())
                    }}
                >
                    Return to the registration page
                </button>
            </div>
        </>
    )
}

export default withNetwork(Login)
