import { systemRoles } from "../../utils/system-roles.js"

export const cartEndPoint={
    createCart:[
        systemRoles.ADMIN,systemRoles.USER
    ]
}
