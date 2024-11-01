import { createAsyncThunk } from '@reduxjs/toolkit'
import { IAuthDto } from '../../interfaces/IAuthDto'
import { ITwoFactorLogin } from '../../interfaces/ITwoFactorLoginDto'
import { AuthService } from '../../services/AuthService'
import { getEmailPasswordErrors } from '../../utils/utilities'
import { getTwoFactorCodeErrors } from '../../utils/utilities'
import { authActions } from '../reducers/AuthReducer'

export const registration = createAsyncThunk('registration', async ({ authDto } : {authDto: IAuthDto}, thunkApi) => {
    try {
        const response = await AuthService.registration(authDto)

        return response
    } catch (error: any) {
        const emailPasswordErrors = getEmailPasswordErrors(error)

        if (emailPasswordErrors !== '') {
            return thunkApi.rejectWithValue(emailPasswordErrors)
        } else {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
})

export const signIn = createAsyncThunk('login', async ({ authDto }: { authDto: IAuthDto }, thunkApi) => {
    try {
        return await AuthService.login(authDto);
    } catch (error: any) {
        const emailPasswordErrors = getEmailPasswordErrors(error);

        if (emailPasswordErrors !== '') {
            return thunkApi.rejectWithValue(emailPasswordErrors);
        } else {          
            const errorMessage = error?.response?.data || "Đăng nhập thất bại do lỗi không xác định";
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
});


export const twoFactorLog = createAsyncThunk('twofactorlog', async ({twofactor}: {twofactor: ITwoFactorLogin}, thunkApi) => {
    try {
        return await AuthService.twofactorlogin(twofactor);
    } catch (error: any) {
        const twoFactorErrors = getTwoFactorCodeErrors(error)
        if (twoFactorErrors !== '') {
            return thunkApi.rejectWithValue(twoFactorErrors)
        } else {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
})

export const logout = createAsyncThunk('logout', async (_, thunkApi) => {
    try {
        return await AuthService.logout()
    } catch (error: any) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})

export const refresh = () => async (dispatch: any) => {
    try {
        dispatch(authActions.refreshPending())
        const response = await AuthService.refresh()
        // console.log(response);
        dispatch(authActions.refreshFulfilled(response))
    } catch (error) {
        dispatch(authActions.refreshRejected())
    }
}
