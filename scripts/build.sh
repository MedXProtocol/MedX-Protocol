#! /bin/sh
npm i --dev && \
npm run truffle-install && \
npm run compile && \
cd lambda && \
./lambda-build.sh && \
cd .. && \
cd dapp && npm i && node --max-old-space-size=4096 scripts/build.js  && cd ..
