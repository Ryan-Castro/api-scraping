import Chromium from'chrome-aws-lambda';
import puppeteer, { Page } from 'puppeteer-core'


export default async function handler(req,res) {
  let result = {}
  let browser = null
  if(req.query.link){
    try{
      browser = await puppeteer.launch({
        args: Chromium.args,
        executablePath: await Chromium.executablePath,
        headless: Chromium.headless,
      });
    
      let page = await browser.newPage()
      await page.goto(req.query.link)
      const src_img = await page.$eval('.slider--img--D7MJNPZ.slider--active--ffqmskh img', (img)=>{return img.src})
      const title_product = await page.$eval('.title--wrap--Ms9Zv4A h1', (title)=>{return title.innerText})
      const base_price = await page.$eval('.price--originalText--Zsc6sMv', (bPrice)=>{return bPrice.innerText.replace('R$', '')})
      const discount_price = await page.$$eval('.es--wrap--erdmPRe.notranslate span', (sPrices)=>{let stn = "";sPrices.map((sPrice)=>{stn += sPrice.innerText});return stn.replace("R$", "").replaceAll(" ", "")})
      const discount_percentage = await page.$eval('.price--discount--xET8qnP', (percentage)=>{return percentage.innerText.replaceAll('-', '').replaceAll('%', '')})
      
      result = {
        'linkImg': src_img,
        'titleProcuct':title_product,
        'basePrice':base_price,
        'diccountPrice':discount_price,
        'discountPercentage':discount_percentage,
      }
    }catch (error) {
        return res.send(error)
      } finally {
        if (browser !== null) {
          await browser.close();
        }
      }
    } else {
      result = {'Erro': 'Sem o link. Adicione o parametro link'}
    }
    return res.send(result)
}


