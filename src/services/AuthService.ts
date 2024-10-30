import { customApi } from '..'
import defaultApi from '../http/DefaultApi'
import { IAuthDto } from '../interfaces/IAuthDto'
import { ITwoFactorLogin } from '../interfaces/ITwoFactorLoginDto'
import { IUserData } from '../interfaces/IUserData'

export class AuthService {
    static registration = async (authDto: IAuthDto, deviceFingerprint: string): Promise<IUserData> => {
        try {
            const response = await defaultApi.post<IUserData>('Auth/Registration', authDto, {
                headers: {
                    'device-fingerprint': deviceFingerprint,
                },
            })

            var data = response.data

            // localStorage.setItem('AccessToken', data.tokensData.accessJwt)

            return data
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static login = async (authDto: IAuthDto, deviceFingerprint: string): Promise<IUserData> => {
        try {
            const response = await defaultApi.post<IUserData>('Auth/Login', authDto, {
                headers: {
                    'device-fingerprint': deviceFingerprint,
                },
            });
            const data = response.data;
            //  console.log(data.requiresTwoFactor);           
            return data;
        } catch (error: any) {
            const errorMessage = error?.response?.data || "Lỗi không xác định khi đăng nhập";
            throw new Error(errorMessage);
        }
    }

    static twofactorlogin = async (twofactorDto: ITwoFactorLogin, deviceFingerprint: string): Promise<IUserData> => {
        try {
            const response = await defaultApi.post<IUserData>('Auth/verify-2fa-login', twofactorDto, {
                headers: {
                    'device-fingerprint': deviceFingerprint,
                },
            });
            const data = response.data;            
            // console.log(data);
            return data;
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static logout = async (): Promise<void> => {
        try {
            await customApi.delete<void>('Auth/Logout')

            localStorage.removeItem('AccessToken')
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static refresh = async (): Promise<IUserData> => {
        try {
            const accessToken = localStorage.getItem('AccessToken')
            const response = await defaultApi.put<IUserData>('Auth/Refresh', accessToken)

            var data = response.data
            console.log(data);
            localStorage.setItem('AccessToken', data.tokensData.accessJwt)

            return data
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }
}
