FROM mumarshahbaz/jekyll:1.0.0

WORKDIR /usr/src/app
ENV JEKYLL_ENV=production

COPY Gemfile Gemfile.lock package.json ./
RUN bundle install
RUN npm install

COPY . .

CMD ["sh", "-c", "npm run build"]