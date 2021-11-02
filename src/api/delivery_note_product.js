import request from "@/utils/request.js"
import Qs from "qs"

export function r_delivery_note_product(note_id) {
    return request({
        url: "api/tio-data?pages=delivery_note_product&action=r_delivery_note_product",
        method: "POST",
        data: Qs.stringify({
          note_id
        })
    })
}

export function r_all_delivery_note_product(note_id) {
    return request({
        url: "api/tio-data?pages=delivery_note_product&action=r_all_delivery_note_product",
        method: "POST",
        data: Qs.stringify({
          note_id
        })
    })
}

export function c_delivery_note_product(values) {
    return request({
        url: "api/tio-data?pages=delivery_note_product&action=c_delivery_note_product",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_delivery_note_product(values) {
    return request({
        url: "api/tio-data?pages=delivery_note_product&action=u_delivery_note_product",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_delivery_note_product(id, discount_id) {
    return request({
        url: "api/tio-data?pages=delivery_note_product&action=d_delivery_note_product",
        method: "POST",
        data: Qs.stringify({
            id, discount_id
        })
    })
}
