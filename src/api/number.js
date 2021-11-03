import request from "@/utils/request.js"
import Qs from "qs"
export function r_invoice_test(pagenum,size,search,search2,select3){
    return request({
        url:"api/tio-data?pages=invoice&action=r_invoice_test",
        method:"POST",
        data:Qs.stringify({
            pagenum,size,search,search2,select3
        })
    })
}
export function c_invoice_test(values){
    return request({
        url:"api/tio-data?pages=invoice&action=c_invoice_number",
        method:"POST",
        data:Qs.stringify({
            ...values
        })
    })
}
export function u_invoice_test(values){
    return request({
        url:"api/tio-data?pages=invoice&action=u_invoice_number",
        method:"POST",
        data:Qs.stringify({
            ...values
        })
    })
}