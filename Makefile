export PATH := node_modules/.bin:$(PATH)

all: .env build-analytic-augmentations
		ts-node src/index.ts

.env:
		cp default.env .env

build-analytic-augmentations: clean-analytic-augmentations
		ts-node src/analytic-augmentations/build.ts question-and-answer

clean-analytic-augmentations:
		rm -rf src/analytic-augmentations/question-and-answer/build
