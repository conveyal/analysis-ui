.PHONY: images

default: images

images:
	# The mogrify command is provided by ImageMagick (brew install imagemagick)
	for file in docs/img/*.png; do mogrify -resize '1024x768>' $$file; done
