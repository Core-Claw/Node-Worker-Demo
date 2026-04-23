#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. 获取输入参数
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)

        // 2. 获取代理配置（从环境变量读取，支持灵活部署）
        const proxyDomain = process.env.PROXY_DOMAIN
        await coresdk.log.info(`代理域名: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`代理认证信息: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`获取代理认证信息失败: ${err.message}`)
            proxyAuth = null
        }

        // 3. 拼接代理 URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`代理地址: ${proxyUrl}`)

        // 4. 业务逻辑处理
        const url = inputJson?.url
        await coresdk.log.info(`开始处理URL: ${url}`)

        // 模拟业务处理结果
        const result = {
            url,
            status: 'success',
            data: [
                {
                    title: '示例标题',
                    content: '示例内容'
                }
            ]
        }

        // 5. 推送结果数据
        await coresdk.log.info(`处理结果: ${JSON.stringify(result)}`)
        const dataObject = result.data;
        for (let index = 0; index < dataObject.length; index++) {
            await coresdk.result.pushData(dataObject[index])
        }
        

        // 6. 设置表格表头
        const headers = [
            {
                label: 'URL',
                key: 'url',
                format: 'text'
            },
            {
                label: '状态',
                key: 'status',
                format: 'text'
            }
        ]

        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('脚本执行完成')
    } catch (err) {
        await coresdk.log.error(`脚本执行异常: ${err.message}`)

        const errorResult = {
            error: err.message,
            error_code: '500',
            status: 'failed'
        }

        await coresdk.result.pushData(errorResult)
        throw err
    }
}

run()
