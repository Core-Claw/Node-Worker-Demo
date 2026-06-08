#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function main() {
    try {
        // 1. Get input parameters
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)

        // 2. Read and log all input fields (demonstrating 11 editor types)
        const urls = inputJson?.urls || []
        const sources = inputJson?.sources || []
        const searchTerms = inputJson?.searchTerms || []
        const location = inputJson?.location || ''
        const notes = inputJson?.notes || ''
        const maxResults = inputJson?.max_results || 100
        const language = inputJson?.language || 'en'
        const category = inputJson?.category || 1
        const dataSections = inputJson?.data_sections || []
        const skipClosed = inputJson?.skip_closed || false
        const sinceDate = inputJson?.since_date || ''

        await coresdk.log.info(`[requestList] urls: ${JSON.stringify(urls)}`)
        await coresdk.log.info(`[requestListSource] sources: ${JSON.stringify(sources)}`)
        await coresdk.log.info(`[stringList] searchTerms: ${JSON.stringify(searchTerms)}`)
        await coresdk.log.info(`[input] location: ${location}`)
        await coresdk.log.info(`[textarea] notes: ${notes}`)
        await coresdk.log.info(`[number] max_results: ${maxResults}`)
        await coresdk.log.info(`[select] language: ${language}`)
        await coresdk.log.info(`[radio] category: ${category}`)
        await coresdk.log.info(`[checkbox] data_sections: ${JSON.stringify(dataSections)}`)
        await coresdk.log.info(`[switch] skip_closed: ${skipClosed}`)
        await coresdk.log.info(`[datepicker] since_date: ${sinceDate}`)

        // 3. Proxy configuration (read from environment variables)
        const proxyDomain = process.env.PROXY_DOMAIN
        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`Proxy authentication: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`Failed to retrieve proxy authentication: ${err.message}`)
            proxyAuth = null
        }

        // 4. Construct proxy URL
        const proxyUrl = proxyAuth ? `socks5://${proxyAuth}@${proxyDomain}` : null
        await coresdk.log.info(`Proxy URL: ${proxyUrl}`)

        // 5. Set table headers
        const headers = [
            { label: 'Primary Key', key: 'id', format: 'text' },
            { label: 'Title', key: 'title', format: 'text' },
            { label: 'Description', key: 'description', format: 'text' },
        ]
        await coresdk.result.setTableHeader(headers)

        // 6. Push data in batches (limited by maxResults)
        const batchSize = 100
        const sleepSeconds = 1

        for (let index = 1; index <= maxResults; index++) {
            const data = {
                id: `test-${index}`,
                title: `Test Title ${index}`,
                description: `This is test description number ${index}`,
            }
            await coresdk.result.upsertData(data, 'id')

            if (index % batchSize === 0) {
                await coresdk.log.info(`Pushed ${index} items`)
                if (index < maxResults) {
                    await new Promise(r => setTimeout(r, sleepSeconds * 1000))
                }
            }
        }

        await coresdk.log.info('Starting second push for multiples of 3')
        for (let index = 3; index <= maxResults; index += 3) {
            const data = {
                id: `test-${index}`,
                title: `Test Title ${index}`,
                description: `This is updated test description number ${index} after second push`,
            }
            await coresdk.result.upsertData(data, 'id')
        }

        await coresdk.log.info('Second push for multiples of 3 completed')
        await coresdk.log.info('Script execution completed')

    } catch (err) {
        await coresdk.log.error(`Script execution error: ${err.message}`)
        const errorResult = {
            error: err.message,
            error_code: '500',
            status: 'failed'
        }
        await coresdk.result.pushData(errorResult)
        throw err
    }
}

main()
