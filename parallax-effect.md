Create a webpage with smooth parallax scrolling effects where both images and text move at different speeds and directions as the user scrolls. The implementation MUST address these critical challenges:

1. **Dual Movement Parallax**: Implement distinct movement for both background images (moving downward at a faster rate) and foreground text (moving upward at a slower rate) to create a dramatic depth effect.
2. **Image Containment**: Ensure parallax images ALWAYS completely fill their containers during scrolling by:
1. Sizing images to 120% of their container width and height
2. Positioning images with negative offsets (-10% top and left)
3. Applying a scale transform of at least 1.2 to prevent edge visibility during movement
4. Using object-fit: cover to maintain aspect ratio

3. **Seamless Transitions**: Create full-viewport-height sections with proper stacking to eliminate any gaps or strips between sections during scrolling.

4. **Performance Optimization**:
1. Use CSS transform for all animations (never change top/left properties)
2. Apply will-change: transform to hint the browser to optimize rendering
3. Implement cubic-bezier easing (e.g., cubic-bezier(0.33, 1, 0.68, 1)) for smooth transitions
4. Keep transition duration short (0.1s) to prevent lag during fast scrolling

5. **Precise Scroll Calculation**:
1. Use React useRef and getBoundingClientRect() to get accurate element positions
2. Calculate element position relative to viewport center (not just top of viewport)
3. Apply parallax effect only when elements are within the viewport
4. Use a normalized distance value to control parallax intensity

6. **Movement Intensity**:
1. Apply a significant movement factor for images (at least -80 for dramatic effect)
2. Use a contrasting movement factor for text (around 20, in the opposite direction)
3. Adjust these values based on desired intensity

7. **Responsive Considerations**:
1. Ensure the parallax container is position: relative
2. Use percentage-based sizing and viewport units
3. Apply proper z-indexing to maintain content hierarchy
4. Add a semi-transparent overlay (e.g., bg-black/40) to improve text readability

8. **Implementation Structure**:
1. Create a reusable component that accepts image paths, content, and layout options
2. Support reversed layouts for visual variety
3. Handle cleanup of scroll event listeners in useEffect return function

The most important requirement is that no matter how fast the user scrolls or how dramatically the parallax elements move, the images must always extend beyond their visible containers to prevent any background from showing through during the animation.
