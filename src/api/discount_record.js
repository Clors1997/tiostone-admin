import request from "@/utils/request.js"
import Qs from "qs"

export function r_discount_record(pagenum, size, invoice_id, search) {
    return request({
        url: "api/tio-data?pages=discount_record&action=r_discount_record",
        method: "POST",
        data: Qs.stringify({
          pagenum, size, invoice_id, search
        })
    })
}

export function r_discount_record_product(invoice_id, num) {
    return request({
        url: "api/tio-data?pages=discount_record&action=r_discount_record_product",
        method: "POST",
        data: Qs.stringify({
          invoice_id,
          record_num: num
        })
    })
}

export function c_discount_record(invoice_id, DN_id, deposit, discount_result) {
    return request({
        url: "api/tio-data?pages=discount_record&action=c_discount_record",
        method: "POST",
        data: Qs.stringify({
          invoice_id,
          DN_id,
          deposit,
          discount_result
        })
    })
}

export function d_discount_record(invoice_id, record_num) {
    return request({
        url: "api/tio-data?pages=discount_record&action=d_discount_record",
        method: "POST",
        data: Qs.stringify({
          invoice_id,
          record_num
        })
    })
}