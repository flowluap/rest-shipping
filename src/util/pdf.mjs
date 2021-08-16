import pdftk from "node-pdftk";
import HummusRecipe  from "hummus-recipe";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export async function rotatePdf(base64) {
  const pdfBuffer = Buffer.from(base64, "base64");
  let label = await pdftk.input(pdfBuffer)
    .rotate("1east")
    .output()
    .then(label => {
      return label;
    })
    .catch(err => {
      console.log(err);
    });
  return label.toString('base64');
}

export async function resizePdf(base64){
  // ToDo rewrite this to work with buffers
  let inputFile = `./tmp/${uuidv4()}.pdf`;
  let outputFile= `./tmp/${uuidv4()}.pdf`;
  await fs.writeFileSync(inputFile, base64,"base64")

  const pdfDoc = new HummusRecipe('new', outputFile, {
    version: 1.6,
    author: 'Rest-Shipping',
    title: 'label',
    subject: 'Imposition of various PDF files for optimized printing.'
  });
  pdfDoc
    .createPage(270,610)

    .overlay(inputFile, 1, 1,{scale:0.7})
    //.overlay('ls.pdf', 15, heightOne + 15)
    .endPage()
    .endPDF();

  let label = fs.readFileSync(outputFile, {encoding: 'base64'});
  await fs.unlinkSync(inputFile);
  await fs.unlinkSync(outputFile);
  return label
}