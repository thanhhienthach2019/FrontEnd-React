import { IUserDto } from './IUserDto';

export interface IUserData {
    dataSend: IDataSend;
}

export interface IDataSend {
    userData: {
        userDto: IUserDto; // Định nghĩa cho thông tin người dùng                       
        deviceFingerprint?: string | null;
        twoFactorCodeLogin?: string | null;
        twoFactorLoginExpiryTime?: string | null;
    };
}
