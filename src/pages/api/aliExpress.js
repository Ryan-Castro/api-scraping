import puppeteer, { Page } from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'



export default async function handler(req,res) {
  try{
    let options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
    if(req.query.link){
      const browser = await puppeteer.launch(options)
      let _page = await browser.newPage()
      await _page.goto(req.query.link)
      const src_img = await _page.$eval('.slider--img--D7MJNPZ.slider--active--ffqmskh img', (img)=>{return img.src})
      const title_product = await _page.$eval('.title--wrap--Ms9Zv4A h1', (title)=>{return title.innerText})
      const base_price = await _page.$eval('.price--originalText--Zsc6sMv', (bPrice)=>{return bPrice.innerText.replace('R$', '')})
      const discount_price = await _page.$$eval('.es--wrap--erdmPRe.notranslate span', (sPrices)=>{let stn = "";sPrices.map((sPrice)=>{stn += sPrice.innerText});return stn.replace("R$", "").replaceAll(" ", "")})
      const discount_percentage = await _page.$eval('.price--discount--xET8qnP', (percentage)=>{return percentage.innerText.replaceAll('-', '').replaceAll('%', '')})
      
      await browser.close()
      return res.status(200).send({
        'linkImg': src_img,
        'titleProcuct':title_product,
        'basePrice':base_price,
        'diccountPrice':discount_price,
        'discountPercentage':discount_percentage,
      })
    } else {
      return res.status(200).send({'Erro': 'Sem o link. Adicione o parametro link'})
    }
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}


