import request from "@/utils/request.js"
import Qs from "qs"

export function r_plate_team(create_id) {
    return request({
        url: "api/tio-data?pages=plate_team&action=r_plate_team",
        method: "POST",
        data: Qs.stringify({
          create_id
        })
    })
}

export function r_plate_no(pagenum, size, search = '') {
  return request({
      url: "api/tio-data?pages=plate_no&action=r_plate_no",
      method: "POST",
      data: Qs.stringify({
        pagenum, size, search
      })
  })
}

export function c_plate_no(data) {
  return request({
      url: "api/tio-data?pages=plate_no&action=c_plate_no",
      method: "POST",
      data: Qs.stringify({
        ...data
      })
  })
}

export function d_plate_no(id) {
  return request({
      url: "api/tio-data?pages=plate_no&action=d_plate_no",
      method: "POST",
      data: Qs.stringify({
        id
      })
  })
}

export function u_plate_number(info) {
    return request({
        url: "api/tio-data?pages=plate_team&action=u_plate_number",
        method: "POST",
        data: Qs.stringify({
          ...info
        })
    })
}

export function c_plate_team(team_name, created_by) {
    return request({
        url: "api/tio-data?pages=plate_team&action=c_plate_team",
        method: "POST",
        data: Qs.stringify({
          team_name, created_by
        })
    })
}

export function d_plate_team(id) {
    return request({
        url: "api/tio-data?pages=plate_team&action=d_plate_team",
        method: "POST",
        data: Qs.stringify({
          id
        })
    })
}
