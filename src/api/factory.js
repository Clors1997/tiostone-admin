import request from "@/utils/request.js"
import Qs from "qs"

export function r_factory(pagenum, size, search) {
    return request({
        url: "api/tio-data?pages=factory&action=r_factory",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search
        })
    })
}

export function c_factory(values) {
    return request({
        url: "api/tio-data?pages=factory&action=c_factory",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_factory(values) {
    return request({
        url: "api/tio-data?pages=factory&action=u_factory",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_factory(id) {
    return request({
        url: "api/tio-data?pages=factory&action=d_factory",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}