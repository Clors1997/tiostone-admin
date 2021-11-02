import request from "@/utils/request.js"
import Qs from "qs"

export function r_invoice(pagenum, size, search, search2, select) {
    return request({
        url: "api/tio-data?pages=invoice&action=r_invoice",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search, search2, select
        })
    })
}

export function r_invoice_client(pagenum, size, search, search2, clientele_id) {
    return request({
        url: "api/tio-data?pages=invoice&action=r_invoice",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search, search2, clientele_id
        })
    })
}

export function c_invoice(values) {
    return request({
        url: "api/tio-data?pages=invoice&action=c_invoice",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_invoice_status(id, invoice_status) {
    return request({
        url: "api/tio-data?pages=invoice&action=u_invoice_status",
        method: "POST",
        data: Qs.stringify({
          id, invoice_status
        })
    })
}

export function u_invoice(values) {
    return request({
        url: "api/tio-data?pages=invoice&action=u_invoice",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_deposit(values) {
    return request({
        url: "api/tio-data?pages=invoice&action=u_deposit",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function d_invoice(id) {
    return request({
        url: "api/tio-data?pages=invoice&action=d_invoice",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}
