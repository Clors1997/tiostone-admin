import request from "@/utils/request.js"
import Qs from "qs"
export function login(login, password) {
    return request({
        url: "api/tio-login",
        method: "POST",
        data: Qs.stringify({
            login, password
        })
    })
}
