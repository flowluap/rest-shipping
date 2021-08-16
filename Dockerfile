FROM node:lts-fermium

RUN apt-get update && apt-get -yq upgrade && apt-get install \
    && apt-get autoremove && apt-get autoclean

WORKDIR /usr/app
RUN mkdir tmp/

COPY package*.json ./
COPY . .
RUN npm install --production
RUN node node_modules/puppeteer/install.js

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get install pdftk -y \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb


RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/app

#for route alias
RUN npm run postinstall

USER pptruser
EXPOSE 3000

CMD ["node", "src/app.mjs"]
