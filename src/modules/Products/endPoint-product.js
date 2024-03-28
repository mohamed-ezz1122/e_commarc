import { systemRoles } from "../../utils/system-roles.js";

export const endPointsRoles = {
    ADD_PRODUCT: [systemRoles.SUPE_ADMIN, systemRoles.ADMIN],
}