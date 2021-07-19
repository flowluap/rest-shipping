import puppeteer from "puppeteer";
import fs from "fs/promises";
import { ShippingProvider } from "../../../../util/provider/ShippingProvider.mjs";


class DpdWebPage {
  constructor(page) {
    this.page = page;
    this.cookies = {};
    this.initialize();
  }

  async initialize() {

    if (!await this.isLoggedIn()) {
      await this.login();
    }
  }

  async isLoggedIn() {
    try {
      const cookiesString = await fs.readFile("./cookies.json");
      const cookies = JSON.parse(cookiesString);
      await this.page.setCookie(...cookies);

      await this.page.goto("https://portal.dpd.de/home_mydpd.aspx");

      return this.page.url() === "https://portal.dpd.de/home_mydpd.aspx";

    } catch (e) {
      return false;
    }
  }

  async login() {
    await this.page.goto("https://business.dpd.de/");
    await this.page.click("#txtMasterLogin");
    await this.page.keyboard.type("");
    await this.page.click("#txtMasterPasswort");
    await this.page.keyboard.type("");

    await this.page.click("#CPLContentSmall_btnMasterLogin");
    await this.page.waitForNavigation();

    //ToDo check if succeeded
    //ToDo save cookie in db
    this.cookies = await this.page.cookies();
    await fs.writeFile("./cookies.json", JSON.stringify(this.cookies, null, 2));
  };

  async getLabel() {
    //await this.page.goto("https://portal.dpd.de/home_mydpd.aspx");
    await this.page.waitForSelector("#modHeader_imgBurger", { visible: true });
    await this.page.click("#modHeader_imgBurger");
    await this.page.waitForSelector("#modHeader_repMobileBurgerNav_repBurgerNavLevel2_3_hplBurgerNav2Sub_1", { visible: true });
    await this.page.click("#modHeader_repMobileBurgerNav_repBurgerNavLevel2_3_hplBurgerNav2Sub_1");
    await this.page.waitForNavigation;
  }

  async incomingParcels() {

    await this.page.waitForSelector("#modHeader_imgBurger", { visible: true });
    await this.page.click("#modHeader_imgBurger");

    await this.page.waitForSelector("#modHeader_repMobileBurgerNav_repBurgerNavLevel2_3_hplBurgerNav2Sub_2", { visible: true });
    await this.page.click("#modHeader_repMobileBurgerNav_repBurgerNavLevel2_3_hplBurgerNav2Sub_2");

    await this.page.waitForSelector("#imgInboundShipments", { visible: true });
    await this.page.click("#imgInboundShipments");
    await this.page.waitForNavigation;

    await this.page.waitForSelector("#tbl_details_table", { visible: true });
    const data = await this.page.$$(".tbl_details_tbody_row");

    for (let link of data) {
      console.log(await link.$$eval("td", (nodes) => nodes.map((n) => n.innerText)));
    }

  }
}

const puppeteerExample = async () => {
  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: true
  });
  let dpdPage = new DpdWebPage(await getCurrentPage(browser));
  //await dpdPage.getLabel();
  await dpdPage.incomingParcels();

  //ToDO
  // getInvoices
  // getIncomingWares
  // trackParcel
  // registerBrokenPackage
  // Unreciviable Packages

};

const getCurrentPage = async (browser) => {
  return (await browser.pages())[0];
};
//puppeteerExample();



