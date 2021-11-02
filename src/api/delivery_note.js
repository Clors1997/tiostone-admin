import request from "@/utils/request.js"
import Qs from "qs"

export function r_delivery_note(pagenum, size, search, invoice_id) {
    return request({
        url: "api/tio-data?pages=delivery_note&action=r_delivery_note",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search, invoice_id
        })
    })
}

export function c_delivery_note(values) {
    return request({
        url: "api/tio-data?pages=delivery_note&action=c_delivery_note",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_delivery_note(values) {
    return request({
        url: "api/tio-data?pages=delivery_note&action=u_delivery_note",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_delivery_note(id) {
    return request({
        url: "api/tio-data?pages=delivery_note&action=d_delivery_note",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}
