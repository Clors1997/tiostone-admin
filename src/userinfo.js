import request from "@/utils/request.js"
export function userinfo() {
    return request({
        url: "aiuserinfo",
        method: "GET"
    })
}
