export PATH := node_modules/.bin:$(PATH)

all: .env build-augmentations
		ts-node src/index.ts

.env:
		cp default.env .env

build-augmentations: clean-augmentations
		ts-node src/augmentations/build.ts question-and-answer
		ts-node src/augmentations/build.ts browser-builder

clean-augmentations:
		rm -rf src/augmentations/question-and-answer/build
		rm -rf src/augmentations/browser-builder/build
