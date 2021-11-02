const error_code = [
    {
        code: "e_0001",
        domain: "router",
        title: "錯誤號碼 - e_0001 - 閒置時間太長",
        content: '系統發現頁面閒置時間過長，或頁面被手動刷新，請重新選擇大廈'
    },
    {
        code: "e_0002",
        domain: "router",
        title: "錯誤號碼 - e_0002 - url資料不符",
        content: '系統發現用戶所輸入的大廈和系統資料不符, 請重新選擇大廈'
    },
    {
        code: "e_0003",
        domain: "router",
        title: "錯誤號碼 - e_0003 - TOKEN已過期",
        content: '系統發現用戶的登入TOKEN已過期或沒有TOKEN, 請重新登入'
    }
]

export function getErrorCodeByCode(CODE) {
    return error_code.find(({ code }) => code === CODE);
}
