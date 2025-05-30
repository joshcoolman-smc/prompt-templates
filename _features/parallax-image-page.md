Create a modern parallax scrolling page using Next.js and react-scroll-parallax. The page should have [NUMBER] full-height sections, each with a parallax background image and centered text content. Each section should smoothly transition to the next as the user scrolls, with the background images moving at different speeds to create depth.
### Technical Requirements:
1. Use Next.js with the App Router
2. Implement parallax scrolling using the react-scroll-parallax library
3. Make each section full viewport height with the image covering the entire section
4. Add a semi-transparent dark overlay to improve text readability
5. Center the text content in each section
6. Make the last section include call-to-action buttons
### Critical: Ensuring Complete Image Coverage with Parallax Effect
To guarantee that images always fully cover each section during the parallax effect:
1. **Oversized Container**: Make the parallax container significantly larger than the viewport (140-150% height)
```javascriptreact
<Parallax className="absolute inset-0 h-[140%] w-full">
```
2. **Scale Transformation**: Apply a slight scale transformation to the background image to prevent empty edges
```javascriptreact
style={{
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transform: "scale(1.1)", // Critical for preventing empty edges
}}
```
3. **Optimal translateY Values**: Configure translateY with opposite-direction values to create smooth movement
```javascriptreact
translateY={[`${speed * -20}%`, `${speed * 20}%`]}
```
4. **Root Margin Control**: Add rootMargin to control when the parallax effect begins and ends
```javascriptreact
rootMargin={{ top: 0, right: 0, bottom: 0, left: 0 }}
```
5. **Overflow Control**: Ensure the section has overflow:hidden to prevent any image overflow
```javascriptreact
<section className="relative h-screen w-full overflow-hidden">
```
### For Each Section, Provide:
1. A high-quality image (minimum 1920px wide)
2. A section title (heading)
3. Optional subtitle (for the final section)
4. Section content (paragraph text)
5. Desired parallax speed (between 0.2 and 0.8, where higher values create more dramatic movement)
### Example Section Format:
```plaintext
Section 1:
- Image: [IMAGE_URL_1]
- Title: "Strategic Portland HQ"
- Content: "Our Portland, Oregon headquarters sits at the nexus of creative innovation and technology. Rooted in the Pacific Northwest's dynamic startup ecosystem, we leverage local talent and industry partnerships to deliver cutting-edge design solutions at scale."
- Speed: 0.2
```
### Implementation Details:
1. Create a reusable ParallaxSection component that takes image URL, title, content, and speed as props
2. Set up the main page with all sections using the ParallaxProvider
3. Configure each section with appropriate parallax speeds for visual variety
4. Ensure images fully cover each section with the parallax effect using the techniques described above
5. Add appropriate styling for text readability and visual appeal
### Complete ParallaxSection Component Example:
```javascriptreact
export default function ParallaxSection({
  imageUrl,
  speed,
  title,
  subtitle,
  content,
  isLastSection = false,
}: ParallaxSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <Parallax
        className="absolute inset-0 h-[140%] w-full"
        translateY={[`${speed * -20}%`, `${speed * 20}%`]}
        rootMargin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.1)",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h2>
            {subtitle && <h3 className="mb-6 text-xl font-medium text-gray-200 md:text-2xl">({subtitle})</h3>}
            <div className="mx-auto mb-8 h-1 w-24 bg-white/80" />
            <p className="mb-8 text-lg leading-relaxed text-gray-200 md:text-xl">{content}</p>
            {isLastSection && (
              <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button className="w-full bg-white px-8 py-6 text-lg font-semibold text-black hover:bg-gray-200 sm:w-auto">
                  Book a Discovery Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white px-8 py-6 text-lg font-semibold text-white hover:bg-white/10 sm:w-auto"
                >
                  View Our Portfolio
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```
### Styling Guidelines:
1. Use a dark overlay (background-color: rgba(0,0,0,0.5)) on images to improve text readability
2. Use white text with appropriate hierarchy (larger headings, smaller body text)
3. Include a small divider between the heading and content
4. For the final section, add prominent call-to-action buttons
5. Ensure responsive design that works well on various screen sizes
### Troubleshooting Image Coverage Issues:
If you notice any gaps or empty spaces during scrolling:
1. Increase the height percentage of the parallax container (try 150% or 160%)
2. Increase the scale transformation (try 1.2 or 1.3)
3. Adjust the translateY values to reduce the movement range
4. Use higher quality, larger images that have extra content around the edges
This implementation creates a visually striking parallax scrolling experience where background images always fully cover each section, moving at different speeds than the foreground content to create a sense of depth and immersion.
