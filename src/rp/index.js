/* eslint-disable no-useless-rename,camelcase */
import rp from 'request-promise'
import CryptoJS from 'crypto-js'
import { stringify } from 'query-string'
import config from '../framework/config'

/**
 * 调用微信接口获取微信session 和 openId
 * @param {string} code
 * @returns {Promise<void>}
 */
async function getWxSession(code) {
  const { wx } = config
  const {
    appid,
    secret,
    grant_type,
    jscode2session_url
  } = wx
  const queryHash = stringify({
    appid,
    secret,
    js_code: code,
    grant_type
  })
  const uri = `${jscode2session_url}?${queryHash}`
  const options = {
    method: 'GET',
    uri,
  }
  return rp(options)
}

/**
 * 调用云信接口发送验证码
 * @param mobile
 * @param CurTime
 * @returns {Promise<void>}
 */
async function getSMSCode(mobile, CurTime) {
  const uri = config.SMS.send_sms_uri
  const AppKey = config.SMS.appkey
  const APP_SECRET = config.SMS.secret
  const Nonce = Math.random()
    .toString(36)
    .substr(2, 15)
  const CheckSum = CryptoJS.SHA1(APP_SECRET + Nonce + CurTime)
    .toString()

  const headers = {
    AppKey,
    CurTime,
    Nonce,
    CheckSum
  }
  const options = {
    method: 'POST',
    uri,
    form: {
      mobile,
      codeLen: config.SMS.codeLen
    },
    headers,
    json: true
  }
  return rp(options)
}

/**
 * 调用云信接口校验验证码
 * @param mobile
 * @param code
 * @returns {Promise<void>}
 */
async function checkSMSCode(mobile, code) {
  const uri = config.SMS.check_sms_uri
  const AppKey = config.SMS.appkey
  const APP_SECRET = config.SMS.secret
  const CurTime = Math.floor(Date.now() / 1000)
  const Nonce = Math.random()
    .toString(36)
    .substr(2, 15)
  const CheckSum = CryptoJS.SHA1(APP_SECRET + Nonce + CurTime)
    .toString()
  const headers = {
    AppKey,
    CurTime,
    Nonce,
    CheckSum
  }
  const options = {
    method: 'POST',
    uri,
    form: {
      mobile,
      code
    },
    headers,
    json: true
  }
  return rp(options)
}

/**
 * 获取用户token列表
 * @param mobile
 * @returns {Promise<void>}
 */
async function getUserTokens(mobile) {
  const uri = `${config.business.base}/v2/endusers/${mobile}/tokens`
  const options = {
    method: 'GET',
    uri,
    json: true
  }
  return rp(options)
}

/**
 * 获取用户信息
 * @param mobile
 * @returns {Promise<void>}
 */
async function getUserInfo(mobile) {
  const uri = `${config.business.base}/v2/endusers`
  const options = {
    method: 'POST',
    uri,
    form: {
      contactPhoneNumber: mobile,
    },
    json: true
  }
  return rp(options)
}

/**
 * 扫码根据code获取token信息
 * @param mobile
 * @param code // 二维码扫到的数据
 * @returns {Promise<void>}
 */
async function verification(mobile, code) {
  const uri = `${config.business.base}/v2/endusers/${mobile}/verifications/${code}`
  const options = {
    method: 'GET',
    uri,
    json: true
  }
  return rp(options)
}

/**
 * 发货
 * @param from
 * @param to
 * @param tokenId
 * @returns {Promise<void>}
 */
async function deliver(from, to, tokenId) {
  const uri = `${config.business.base}/v2/endusers`
  const options = {
    method: 'POST',
    uri,
    form: {
      from,
      to,
      tokenId
    },
    json: true
  }
  return rp(options)
}

export default {
  getWxSession,
  getSMSCode,
  checkSMSCode,
  getUserTokens,
  getUserInfo,
  verification,
  deliver
}
