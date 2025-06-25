### "Capture This" Command
When the user says "capture this", "save that", "add this to the README" or similar:
1. Take the transcribed text from their voice input verbatim
2. Perform a light editorial pass to fix spelling, punctuation, and odd sentence construction while keeping it faithful to the transcript
3. Get the current date/time using bash command `date`
4. Create a descriptive title that captures the essence of the entry
5. Prepend to the top of README.md (after any blank lines at the start) following the existing pattern:
   - Add timestamp header (e.g., "Sunday, June 22, 2025 at 08:00 AM")
   - Add a blank line
   - Add "## [Descriptive Title]"
   - Add a blank line
   - Add the edited transcript content
   - Add a blank line
   - Create bullet point summaries of key points
   - Add a blank line
   - Add "---" separator
   - Add a blank line before the previous entry
6. Git commit with a descriptive message and push after each capture
