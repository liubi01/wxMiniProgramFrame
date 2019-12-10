import Config from '../config/config';
let token = "";
const loginQueue = [];
let isLoginning = false;
/**
 * 获取token
 */
function getToken() {
    return new Promise((res, rej) => {
        // 本地token丢失，重新登录
        if (!token) {
            loginQueue.push({ res, rej });
            if (!isLoginning) {
                isLoginning = true;
                wxlogin()
                    .then((r1) => {
                        isLoginning = false;
                        while (loginQueue.length) {
                            loginQueue.shift().res(r1);
                        }
                    })
                    .catch((err) => {
                        isLoginning = false;
                        while (loginQueue.length) {
                            loginQueue.shift().rej(err);
                        }
                    });
            }
        } else {
            res(token);
        }
    });
}
/**
 * 调用微信登录
 */
function wxlogin() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}
function getUserInfo() {
    return new Promise(function (resolve, reject) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        withCredentials: true,
                        success: function (res) {
                            if (res.errMsg === 'getUserInfo:ok') {
                                resolve(res);
                            } else {
                                reject(res)
                            }
                        },
                        fail: function (err) {
                            reject(err);
                        }
                    })
                } else {
                    wx.login('/pages/');
                }
            }
        })
    });
}
/**
 * 封封微信的的request
 */
function request(url, { data = {}, method = "GET", header = {} } = {}) {
    // 统一注入约定的header
    token = wx.getStorageSync('token');
    let headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Bearer ' + token
    };
    Object.assign(headers, header);
    return new Promise(function (resolve, reject) {
        wx.showLoading({
            title: "请稍等"
        });
        wx.request({
            url: url,
            data: data,
            method: method,
            header: headers,
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 1) {
                    if (!res.data.message && !res.data.data) {
                        showErrorToast("网络异常！");
                    } else {
                        showErrorToast(res.data.message || res.data.data);
                    }
                    if (res.data.status == 401) {
                        wx.clearStorageSync();
                        setTimeout(() => {
                            wx.redirectTo({
                                url: '/pages/login/login'
                            })
                        }, 1000);
                        // //需要登录后才可以操作
                        // let code = null;
                        // return wxlogin().then((res) => {
                        //     code = res.code;
                        //     console.log(1);
                        //     return getUserInfo();
                        // }).then((userInfo) => {
                        //     wx.setStorageSync('userInfo', res.data.userInfo);
                        //     wx.setStorageSync('code', res.data.code);
                        //     console.log(2);
                        //     // wx.setStorageSync('token', res.data.token);
                        //     wx.redirectTo({
                        //         url: '/pages/login/login'
                        //     })
                        // }).catch((err) => {
                        //     console.log(err);
                        //     reject(err);
                        // })
                    }
                    return;
                }
                resolve(res.data);
            },
            fail: function (err) {
                wx.hideLoading();
                showErrorToast("网络异常！");
                reject(err)
            },
            complete: function (res) {
                // wx.hideLoading();
            }
        })
    });
}
function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
        // image: '/assets/image/icon_error.png'
    })
}
function get(url, params = {}) {
    params.method = "GET";
    return new Promise((resolve, rej) => {
        return request(url, params).then(res => {
            resolve(res);
        })
    })
}
function put(url, params = {}) {
    params.method = "PUT";
    return new Promise((resolve, rej) => {
        return request(url, params).then(res => {
            resolve(res);
        })
    })
}
function post(url, params = {}) {
    params.method = "POST";
    return new Promise((resolve, rej) => {
        return request(url, params).then(res => {
            resolve(res);
        })
    })
}
module.exports = {
    request,
    get,
    post,
    put,
    // redirect,
    // showErrorToast,
    checkSession,
    wxlogin,
    getUserInfo,
}