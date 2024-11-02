import { customApi } from '..'
import { IUserDto } from '../interfaces/IUserDto'

export class UserService {
    static getAllUsers = async (): Promise<IUserDto[]> => {
        try {
            const response = await customApi.get<IUserDto[]>('User/GetUsers')
            return response.data
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }
}
