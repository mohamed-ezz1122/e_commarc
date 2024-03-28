


 import { customAlphabet } from 'nanoid'

 export const generateUniqueString = (length) => {

    const nanoid = customAlphabet('12345asdfgh', length || 13)
    return nanoid()
}


