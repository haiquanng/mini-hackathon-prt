import {chromium} from '@playwright/test'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
 page.on('pageerror', e=>console.log('PAGE ERROR', e.message))
 for(const [path,width,name] of [['/',1440,'campus-desktop'],['/',390,'campus-mobile'],['/anh-mau?to=i109',390,'gallery-mobile'],['/xac-nhan-vi-tri?mau=campus&to=i109',390,'recognition-mobile']]) {
  await page.setViewportSize({width,height:width>800?900:844})
  await page.goto(`http://localhost:4173${path}`,{waitUntil:'networkidle'})
  if(path==='/') await page.locator('.scene-canvas canvas').waitFor()
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
  await page.screenshot({path:`artifacts/${name}.png`,fullPage:path.startsWith('/xac-nhan-vi-tri')})
 }
 console.log('Screenshots captured')
} finally {await browser.close()}
