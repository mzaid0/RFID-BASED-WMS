

export const wait = async (timeInMiliSeconds: number) => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, timeInMiliSeconds)
    })
}