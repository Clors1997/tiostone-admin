import request from "@/utils/request.js"
import Qs from "qs"

export function r_invoice_discount(invoice_id) {
    return request({
        url: "api/tio-data?pages=invoice_discount&action=r_invoice_discount",
        method: "POST",
        data: Qs.stringify({
          invoice_id
        })
    })
}

export function r_invoice_discount_by_dn(invoice_id, DN_id) {
    return request({
        url: "api/tio-data?pages=invoice_discount&action=r_invoice_discount_by_dn",
        method: "POST",
        data: Qs.stringify({
          invoice_id,
          DN_id
        })
    })
}

export function c_invoice_discount(values) {
    return request({
        url: "api/tio-data?pages=invoice_discount&action=c_invoice_discount",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_invoice_discount(values) {
    return request({
        url: "api/tio-data?pages=invoice_discount&action=u_invoice_discount",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_invoice_discount(id, product_id) {
    return request({
        url: "api/tio-data?pages=invoice_discount&action=d_invoice_discount",
        method: "POST",
        data: Qs.stringify({
            id, product_id
        })
    })
}