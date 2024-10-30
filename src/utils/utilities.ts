export const getEmailPasswordErrors = (error: any) => {
    let emailPasswordErrors = ''

    error.response.data.errors?.Email?.forEach((item: string) => {
        emailPasswordErrors += item
    })

    error.response.data.errors?.Password?.forEach((item: string) => {
        emailPasswordErrors += item
    })

    return emailPasswordErrors
}
export const getTwoFactorCodeErrors = (error: any) => {
    let twoFactorCodeErrors = ''

    error.response.data.errors?.twofactor?.forEach((item: string) => {
        twoFactorCodeErrors += item
    })
    return twoFactorCodeErrors
}
