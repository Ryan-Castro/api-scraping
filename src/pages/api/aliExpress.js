const chromium = require('chrome-aws-lambda');


export default async function handler(req,res) {
  let result = {}
  let browser = null
  if(req.query.link){
    try{
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
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
      return res.send(result)
      } catch (error) {
        return res.send({'a': error})
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


