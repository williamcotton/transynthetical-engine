export PATH := node_modules/.bin:$(PATH)

all: .env build-augmentations
		ts-node src/index.ts

.env:
		cp default.env .env

build-augmentations: clean-augmentations
		ts-node src/augmentations/build.ts question-and-answer
		ts-node src/augmentations/build.ts browser-builder
		ts-node src/augmentations/build.ts browser-archiver
		ts-node src/augmentations/build.ts iqlang
		ts-node src/augmentations/build.ts react-builder

clean-augmentations:
		rm -rf src/augmentations/question-and-answer/build
		rm -rf src/augmentations/browser-builder/build
		rm -rf src/augmentations/browser-archiver/build
		rm -rf src/augmentations/iqlang/build
		rm -rf src/augmentations/react-builder/build

train-qa:
		ts-node trainer/index.ts