import {chromium} from '@playwright/test'
import {readFile} from 'node:fs/promises'
const svg=await readFile('public/favicon.svg','utf8')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
try {
 for(const [size,name,mask] of [[192,'icon-192',false],[512,'icon-512',false],[512,'maskable-512',true],[180,'apple-touch-icon',false]]) {
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1})
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;width:100vw;height:100vh;background:#C4232A;display:grid;place-items:center}svg{width:${mask?'65%':'100%'};height:${mask?'65%':'100%'}}</style>${svg}`)
  await page.screenshot({path:`public/icons/${name}.png`}); await page.close()
 }
}finally{await browser.close()}
