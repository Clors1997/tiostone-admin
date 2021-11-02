import request from "@/utils/request.js"
import Qs from "qs"

export function r_product_meta() {
    return request({
        url: "api/tio-data?pages=product_meta&action=r_product_meta",
        method: "POST",
        data: Qs.stringify({
        })
    })
}

export function c_product_meta(info) {
    return request({
        url: "api/tio-data?pages=product_meta&action=c_product_meta",
        method: "POST",
        data: Qs.stringify({
          ...info
        })
    })
}

export function d_product_meta(id) {
    return request({
        url: "api/tio-data?pages=product_meta&action=d_product_meta",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}