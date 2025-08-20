FROM mumarshahbaz/jekyll:1.0.0

WORKDIR /usr/src/app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY package.json ./
RUN npm install

COPY . .