import { IDataSend } from './IDataSend'
import { ITokensData } from './ITokensData'


export interface IUserData {
    dataSend: IDataSend;
    requiresTwoFactor: boolean;
    expiryTime: number;
    tokensData: ITokensData; // Định nghĩa cho token 
}