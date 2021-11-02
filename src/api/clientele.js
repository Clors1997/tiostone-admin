import request from "@/utils/request.js"
import Qs from "qs"

export function r_clientele(pagenum, size, search) {
    return request({
        url: "api/tio-data?pages=clientele&action=r_clientele",
        method: "POST",
        data: Qs.stringify({
          size, pagenum, search
        })
    })
}

export function r_last_no() {
    return request({
        url: "api/tio-data?pages=clientele&action=r_last_no",
        method: "POST"
    })
}

export function c_clientele(values) {
    return request({
        url: "api/tio-data?pages=clientele&action=c_clientele",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_clientele(values) {
    return request({
        url: "api/tio-data?pages=clientele&action=u_clientele",
        method: "POST",
        data: Qs.stringify({
            ...values
        })
    })
}

export function u_clientele_plate(values, id) {
    return request({
        url: "api/tio-data?pages=clientele&action=u_plate_number",
        method: "POST",
        data: Qs.stringify({
            plate_number_group: values,
            id
        })
    })
}

export function d_clientele(id) {
    return request({
        url: "api/tio-data?pages=clientele&action=d_clientele",
        method: "POST",
        data: Qs.stringify({
            id
        })
    })
}
