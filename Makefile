export PATH := node_modules/.bin:$(PATH)

all: .env
		ts-node src/index.ts

.env:
		cp default.env .env

build-analytic-augmentations:
		ts-node src/analytic-augmentations/build.ts
