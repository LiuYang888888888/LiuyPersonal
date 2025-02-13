import { sm2, sm3 } from 'sm-crypto'
const publicKey = '047c27415ac98063322946eef6df9697965088c19f93db8d72d9f9ab6acaef574a655b22e05d657a502f986f6d1496c4db4f25bcaaf7793afe510ad1e474f9e8a2'

/**
 * SM2加密string数据
 * @param {*} txt 原始数据
 * @returns  加密后数据
 */
export const encryptSM2 = (txt) => {
  //为0时在加密的串前加上04,后端才能解密成功,同样后端加密后也会返回带04的加密串给前端,cipherMode为1的话必须去掉04才能解密成功
  const cipherMode = 1;// 1 - C1C3C2，0 - C1C2C3，默认为1  加密策略
  // const publicKey =  sm2.generateKeyPairHex().publicKey // 一般由后端定义
  // const item = Buffer.from(txt, 'utf8').toString('hex')
  // console.log('hex：'+item);
  let encryptData = sm2.doEncrypt(txt, publicKey, cipherMode) // 加密结果
  return encryptData
}

/**
 * SM3加密string数据
 * @param {*} txt 原始数据
 * @returns 加密后数据
 */
export const encryptSM3 = (txt) => {
  let encryptData = sm3(txt) // 加密结果
  return encryptData
}