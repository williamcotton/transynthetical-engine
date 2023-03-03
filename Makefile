export PATH := node_modules/.bin:$(PATH)

all: .env build-augmentations
		ts-node src/index.ts

.env:
		cp default.env .env

build-augmentations: clean-augmentations
		ts-node src/augmentations/build.ts question-and-answer

clean-augmentations:
		rm -rf src/augmentations/question-and-answer/build
