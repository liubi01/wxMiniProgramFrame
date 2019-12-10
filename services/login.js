const api = require("../config/api.js");
const req = require("../utils/req.js");
const utils = require("../utils/util.js");
const scope = 'server';
const Login = {
    loginFn(username, password) {
        let data = {
            grant_type: "password",
            scope: "server",
            username: username,
            password: password,
        };
        data.randomStr = utils.randomLenNum(4, true);
        const user = utils.encryption({
            data: data,
            key: 'pigxpigxpigxpigx',
            param: ['password']
        })
        return req.post(api.LoginUrl + "?" + utils.qsString(user), {
            header: {
                isToken: false,
                'TENANT-ID': '1',
                'Authorization': 'Basic ZHJpdmVyOmRyaXZlcg=='
            },
        },
        )
    },
    logoutFn() {
        let token = wx.getStorageSync('token');
        if (token) {
            try {
                wx.clearStorageSync();
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/login/login'
                    })
                }, 500);
            } catch (error) {
                console.log(error);
            }
        }
    },
    refreshToken(refresh_token) {
        const grant_type = 'refresh_token';
        return req.post(api.LoginUrl, {
            header: {
                'Content-Type': 'multipart/form-data;boundary=XXX',
                'isToken': false,
                'TENANT-ID': '1',
                'Authorization': 'Basic ZHJpdmVyOmRyaXZlcg=='
            },
            data:                                 //小程序暂不支持自动构建form-data
                '\r\n--XXX' +
                '\r\nContent-Disposition: form-data; name="scope"' +
                '\r\n' +
                '\r\n'+scope +
                '\r\n--XXX' +
                '\r\nContent-Disposition: form-data; name="refresh_token"' +
                '\r\n' +
                '\r\n'+refresh_token +
                '\r\n--XXX' +
                '\r\nContent-Disposition: form-data; name="grant_type"' +
                '\r\n' +
                '\r\n'+grant_type +
                '\r\n--XXX--'
        }).then(data => {
            if (data) {
                wx.setStorageSync('token', data.access_token)
                wx.setStorageSync('refresh_token', data.refresh_token)
                wx.setStorageSync('expires_in', data.expires_in)
            }
        });
    }
}
module.exports = Login