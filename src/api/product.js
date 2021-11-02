import request from "@/utils/request.js"
import Qs from "qs"

export function r_product(pagenum, size, search) {
    return request({
        url: "api/tio-data?pages=product&action=r_product",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search
        })
    })
}

export function c_product(values) {
    return request({
        url: "api/tio-data?pages=product&action=c_product",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_product(values) {
    return request({
        url: "api/tio-data?pages=product&action=u_product",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_product(id) {
    return request({
        url: "api/tio-data?pages=product&action=d_product",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}