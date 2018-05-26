# comparison-slider
A tiny, dependency-free, responsive comparison slider

**Tiny:** ~1.5kb(js) ~1KB(css) minified, less when gzipped
**responsive:** works on mobile and adjusts with browser resize

> Based on: https://github.com/Paul-Browne/image-comparison-slider/blob/master/image-comparison-slider.js

> There are many kinds of comparison slider, this one is based on [css clip property](https://www.w3schools.com/cssref/pr_pos_clip.asp)


## Why another comparison slider?
I've looked everywhere for a simple, responsive and tiny slider (<3KB), to no avail.
Found this: https://github.com/Paul-Browne/image-comparison-slider/blob/master/image-comparison-slider.js
But it needed a little more work to suite my need (optimization, responsiveness and support touch mobile devices)

## Example
Clone this repo, and take a look at the [example](/examples/example.html) HTML in the `examples` folder.


# Build from source
`npm start` will run both the CSS and JS minifiers on the src folder. Results are outputted to the `dist` folder