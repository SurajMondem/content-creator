# Persona AI Web App – Milestone-Based Work Breakdown Structure

## Milestone 1: Project Setup & Architecture

- **Task:** Initialize Next.js project and repository for Persona AI

  - **Cursor Prompt:** Initialize a Next.js 13 project (TypeScript) named "persona-ai", and set up a Git repository for version control
  - **Human Notes:** Requires Node.js and npm installed; run `npx create-next-app@latest persona-ai --typescript`; ensure initial commit to GitHub for collaboration

- **Task:** Install and configure Tailwind CSS for styling

  - **Cursor Prompt:** Install Tailwind CSS and PostCSS via npm, then add Tailwind config with dark mode set to `class` and import Tailwind in globals.css
  - **Human Notes:** After `npm install tailwindcss postcss autoprefixer`, run `npx tailwindcss init -p`; verify that the Tailwind config enables dark mode (`"darkMode": "class"`) per design requirements

- **Task:** Integrate Shadcn UI library and icon set

  - **Cursor Prompt:** Add Shadcn UI components and Lucide Icons to the project for ready-made UI elements (sidebar, dropdowns, modals, etc.)
  - **Human Notes:** Follow Shadcn UI installation guide (may involve running a CLI or copying component code); ensure Lucide Icons package is installed (`npm install lucide-react`) for use in navigation items

- **Task:** Set up Supabase and Prisma for database

  - **Cursor Prompt:** Install Prisma (`npm install prisma @prisma/client`) and initialize it, then configure the Prisma schema to use Supabase Postgres (provide the connection URL in .env)
  - **Human Notes:** Requires creating a Supabase project and obtaining the database URL and service role key; update the `.env` with `DATABASE_URL` from Supabase; run `npx prisma init` and set the datasource to the Supabase URL (Postgres)

- **Task:** Define initial database schema models

  - **Cursor Prompt:** In `schema.prisma`, define models for User, Post, Template, and SocialIntegration with fields as per design (user info, post content/status, template details, OAuth tokens)
  - **Human Notes:** Include fields like `id`, `createdAt`/`updatedAt` timestamps, etc.; mark relations (e.g. Post has a foreign key to User); after defining, run `npx prisma migrate dev --name init` to apply migration to Supabase

- **Task:** Integrate Clerk for user authentication

  - **Cursor Prompt:** Install Clerk SDK (`npm install @clerk/nextjs`) and wrap the Next.js app with <ClerkProvider>, enabling user sign-up/login and session management
  - **Human Notes:** Requires a Clerk account – obtain Clerk Publishable Key and Secret Key and add them to environment variables; use Clerk <SignedIn>/<SignedOut> components or middleware to protect routes

- **Task:** Prepare OAuth credentials for LinkedIn and Twitter

  - **Cursor Prompt:** Set up environment variables for LinkedIn and Twitter OAuth (client IDs, secrets, callback URLs) and configure placeholders in the Next.js app
  - **Human Notes:** Register a LinkedIn app and a Twitter Developer app manually to get OAuth client ID/secret and callback URL; store these in `.env` (e.g. `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`); no coding output, but needed before implementing OAuth flows

- **Task:** Set up initial Next.js route structure
  - **Cursor Prompt:** Create basic Next.js pages for main routes: `/dashboard`, `/new-post`, `/posts`, `/settings`, and `/templates` (can be simple placeholders for now)
  - **Human Notes:** Ensure these routes are accessible (for example, add links in the index page for navigation during development); this scaffolding will be built out in later milestones

## Milestone 2: Core Features – Input, Formatting, Previews

- **Task:** Implement content input component for text

  - **Cursor Prompt:** Create a React component with a large `<textarea>` for users to input raw text content (e.g. placeholder "Write your idea...")
  - **Human Notes:** Use Tailwind classes for styling (e.g. full width, reasonable height); ensure this component is part of the New Post page; no external dependencies required

- **Task:** Add image upload functionality

  - **Cursor Prompt:** Enhance the content input component with an option to upload an image (use an `<input type="file">` or drag-and-drop area) and display a preview of the selected image
  - **Human Notes:** May use a small library for drag-drop or just default file input; ensure the image preview is shown (e.g. as an <img> element) so user knows what’s attached; plan to store image in Supabase storage later (requires bucket setup and API keys)

- **Task:** Integrate LLM service for content formatting

  - **Cursor Prompt:** Implement an API route (e.g. `/api/formatContent`) that accepts raw text (and optional image reference) and uses an LLM (via OpenAI API) to generate two outputs: one formatted for LinkedIn and one for Twitter
  - **Human Notes:** Requires an OpenAI API key in env (`OPENAI_API_KEY`); define prompt templates (e.g. "Format this idea as a professional LinkedIn post: ...") and call the OpenAI completion endpoint; use a moderate model (GPT-3.5 or GPT-4) to balance cost and quality

- **Task:** Define content template prompts for each platform

  - **Cursor Prompt:** Create prompt strings or functions for LinkedIn and Twitter that incorporate the user’s raw input (e.g. "LinkedIn style: ...\n\n{userInput}") for use in the LLM API call
  - **Human Notes:** Use the Product Requirements doc to guide tone/length (LinkedIn post more professional, Twitter more concise); these templates might be stored in the Templates table or as constants initially

- **Task:** Implement real-time preview update trigger

  - **Cursor Prompt:** In the New Post page, when the user submits input (or stops typing for a moment), call the `/api/formatContent` endpoint and retrieve formatted results to update the previews dynamically
  - **Human Notes:** Use a debounce (e.g. 500ms) on text input change to avoid too many API calls; or provide a "Generate Preview" button for manual trigger to simplify initial implementation; handle loading state while waiting for LLM response

- **Task:** Create LinkedIn post preview component

  - **Cursor Prompt:** Build a preview component that displays formatted text in a card styled like a LinkedIn post (dark background in dark mode, appropriate font and spacing). Make the text content editable (contentEditable div or controlled component) so users can tweak it inline
  - **Human Notes:** Use Tailwind to mimic LinkedIn styling (e.g. a border, padding, maybe an icon indicating LinkedIn); for inline editing, ensure changes are captured in state separate from the raw input; no external libs needed, basic contentEditable or an input field is sufficient

- **Task:** Create Twitter tweet preview component

  - **Cursor Prompt:** Build a preview component for Twitter content, styled like a tweet (smaller width, Twitter-like colors/icons). The text should also be inline-editable by the user
  - **Human Notes:** Use Tailwind (e.g. Twitter blue for highlights) and possibly a Tweet layout (profile pic placeholder, etc., if desired for authenticity); ensure editing here updates the Twitter content state; keep both previews in sync with any changes from re-generating the LLM output

- **Task:** Handle image display in previews

  - **Cursor Prompt:** If an image was uploaded, ensure both LinkedIn and Twitter preview components show the image (e.g. as an attached image thumbnail beneath the text content)
  - **Human Notes:** Check platform constraints (Twitter may have specific image aspect ratio, LinkedIn might show a smaller preview); for now, simply rendering the uploaded image is fine; no external dependency but ensure <img> has alt text for accessibility

- **Task:** Sync edited preview content with final state
  - **Cursor Prompt:** When a user edits the content in a preview component, capture those changes in component state so that the final published content uses the edited text instead of the original LLM output
  - **Human Notes:** This likely means maintaining separate state for `linkedInContent` and `twitterContent` that initialize from the LLM output but can diverge if user edits; no external tools needed, just React state management

## Milestone 3: User Interface & Dashboard

- **Task:** Implement the collapsible sidebar navigation

  - **Cursor Prompt:** Create a Sidebar component with nav links for "New Post", "Recent Posts", "Templates", "Settings" and a profile avatar at the bottom. Include a collapse toggle button that reduces the sidebar to icons only
  - **Human Notes:** Use Shadcn UI for the layout and a toggle icon; use Lucide icons for each nav item (e.g. edit icon for New Post, list icon for Posts, etc.); follow design doc for accent color (#ff5400) highlights on active link; ensure the sidebar can collapse/expand (store a boolean state, add CSS width changes and hide text labels when collapsed)

- **Task:** Implement profile menu with logout

  - **Cursor Prompt:** Add a profile avatar/icon in the sidebar bottom that, when clicked, opens a dropdown menu with a "Logout" option (use Clerk’s signOut function for logout action)
  - **Human Notes:** Leverage Shadcn UI’s DropdownMenu component for the profile menu; ensure Clerk is properly configured to handle session sign-out; no additional dependencies, but ensure the avatar shows the user's image or initials if available from Clerk

- **Task:** Implement global theme (dark/light mode) toggle

  - **Cursor Prompt:** Create a ThemeToggle component that switches between dark and light mode using Next.js context or a state hook, applying the Tailwind `dark` class on <html> accordingly
  - **Human Notes:** The UI design calls for a prominent theme toggle (could be placed in the top navigation bar or settings page); can use a Switch from Shadcn UI or a simple button with sun/moon icon; ensure user preference persists (e.g. save to localStorage or user profile in DB if desired)

- **Task:** Build the Dashboard layout container

  - **Cursor Prompt:** Set up a main Layout component that uses a CSS grid or flex to position the sidebar on the left and the main content area on the right. Apply this layout to all relevant pages (New Post, Posts, Templates, Settings) for consistent structure
  - **Human Notes:** Next.js App Router can use a layout.js to wrap child routes; ensure the sidebar stays fixed and only main content scrolls if needed; consult UX design doc for spacing and responsiveness guidelines

- **Task:** Develop the "New Post" creation page UI

  - **Cursor Prompt:** Assemble the New Post page by combining the text input component, image upload, and the two preview components side by side. Include a "Generate" button (if using manual trigger) and a placeholder "Publish" button (disabled for now) at the bottom of the page
  - **Human Notes:** Ensure the layout is responsive (previews might stack on smaller screens); use a split view on desktop per design; follow the UX doc’s real-time preview behavior (the Generate button may be optional if auto-update is implemented)

- **Task:** Implement the "Recent Posts" dashboard page

  - **Cursor Prompt:** Create a Recent Posts page that fetches the current user’s posts from the database and displays them in a list or grid. Each item should show the post title or first line, status (Draft/Published), and timestamp, with an option to edit or delete
  - **Human Notes:** Use Prisma to fetch posts (e.g. via getServerSideProps or a client-side SWR fetch to an API endpoint); display a status badge (Draft = gray, Published = green, etc., using Tailwind styles); ensure clicking an item navigates to edit that post (e.g. `/new-post?postId=XYZ` to load it)

- **Task:** Implement post editing navigation

  - **Cursor Prompt:** Enable the ability to load an existing post into the New Post page: if a query param like `postId` is present, fetch that post’s data and initialize the input and previews with it (including any saved image)
  - **Human Notes:** Use Next.js useRouter to read query params, fetch via Prisma (server-side or client-side as appropriate); if editing, perhaps change the page title to "Edit Post"; ensure that generating preview again will use the raw content or the last saved content as needed

- **Task:** Develop the "Templates" management page

  - **Cursor Prompt:** Create a Templates page that displays a list of content templates available. For each template, show its name and description. (Optional: allow selecting a template to use for new posts)
  - **Human Notes:** Fetch template list from the Templates table (seed the DB with default LinkedIn/Twitter templates); if implementing selection, you may include a "Use this template" button that sets a default for new posts or opens the new post page with that template; no external API needed beyond Prisma query

- **Task:** Develop the "Settings" page for user settings

  - **Cursor Prompt:** Build a Settings page with user-specific options: e.g. a section for Theme (dark/light toggle), Connected Accounts (LinkedIn, Twitter status and connect/disconnect buttons), and profile info display (name, email)
  - **Human Notes:** Use Clerk to fetch user profile data for display; for connected accounts, use data from SocialIntegrations table to show if accounts are linked; the theme toggle here should mirror the global one (or simply link to the same state)

- **Task:** Ensure responsive design and sidebar behavior
  - **Cursor Prompt:** Add responsive CSS (Tailwind breakpoints) so that on smaller screens the sidebar collapses or becomes a hamburger menu. Ensure the main content reflows (e.g. previews stack vertically on mobile) and all functionality remains accessible
  - **Human Notes:** Test the UI on different screen sizes (mobile, tablet, desktop); possibly implement the sidebar to auto-hide on narrow screens with a menu button to toggle it; use CSS media queries or Tailwind classes (e.g. `hidden md:block` for sidebar)

## Milestone 4: Publishing & OAuth Integration

- **Task:** Finalize user auth flow with Clerk

  - **Cursor Prompt:** Implement a dedicated login page or modal using Clerk’s <SignIn /> component, and ensure unauthenticated users are redirected to login before accessing the dashboard
  - **Human Notes:** Configure Clerk routes or components in Next.js (Clerk provides <RedirectToSignIn/>); test creating a new account and logging in; no custom code needed beyond embedding Clerk components and setting route protection

- **Task:** Implement LinkedIn OAuth connection flow

  - **Cursor Prompt:** Create an API route (e.g. `/api/oauth/linkedin`) to initiate LinkedIn OAuth (redirect user to LinkedIn’s auth URL with proper client ID, scopes, and redirect_uri), and another route `/api/oauth/linkedin/callback` to handle the redirect with auth code and fetch the access token
  - **Human Notes:** Set the LinkedIn OAuth app redirect URL to the callback route; scope should include permissions to post (e.g. `w_member_social` for LinkedIn API); upon callback, use LinkedIn token endpoint to exchange code for an access token; store token and LinkedIn user ID in the SocialIntegrations table for the logged-in user

- **Task:** Implement Twitter OAuth connection flow

  - **Cursor Prompt:** Similar to LinkedIn, create `/api/oauth/twitter` and callback routes to handle Twitter OAuth2 (request user authorization and exchange code for tokens)
  - **Human Notes:** Twitter’s OAuth might require PKCE or use OAuth 1.0a depending on API version; choose OAuth 2.0 for simplicity (scope `tweet.write` to allow posting); register callback URL on the Twitter app; store the received access token (and refresh token if provided) in SocialIntegrations table with platform = "Twitter"

- **Task:** UI for connecting social accounts

  - **Cursor Prompt:** On the New Post page (or Settings page), add "Connect to LinkedIn" and "Connect to Twitter" buttons that appear if the user hasn’t linked those accounts. Clicking should initiate the respective OAuth flow (navigate to our OAuth start API route)
  - **Human Notes:** Use platform icons on the buttons for clarity; after successful connect, update UI (could show "Connected" state); ensure to handle cases like user cancels or error (show an error notification)

- **Task:** Implement one-click publish backend logic

  - **Cursor Prompt:** Create an API route `/api/publishPost` that takes the final content for each platform (from request body or database) and posts it to the connected social platforms’ APIs using stored OAuth tokens. Handle posting to LinkedIn (e.g. via their REST API for shares) and Twitter (via Twitter API endpoint)
  - **Human Notes:** For LinkedIn, use the `/ugcPosts` endpoint with the access token and formatted LinkedIn content; for Twitter, use the POST tweet endpoint with the tweet text; include the image if present (LinkedIn requires uploading image to their API first – may omit image support in initial version for simplicity, or include as future enhancement); use appropriate libraries or fetch calls with OAuth tokens

- **Task:** Update post status after publishing

  - **Cursor Prompt:** In the publish API logic, upon successful posting to each platform, update the Post entry in the database: set `status` to "published", and record any post IDs or URLs returned by the platform APIs
  - **Human Notes:** Use Prisma to update the Post record (set `status = "Published"` and e.g. `publishedAt` timestamp); if posting to both platforms, mark published once all are done (or even if one fails, you might still mark as partially published – but for MVP, treat as published if at least one succeeds); possibly log errors for any failures for debugging

- **Task:** Implement front-end publish action and feedback

  - **Cursor Prompt:** In the New Post page, wire the "Publish" button to call the `/api/publishPost` route (maybe via a fetch or form submission). Provide user feedback: disable the button while publishing, show a loading spinner, and on success show a confirmation message (use a toast notification)
  - **Human Notes:** Use the Sonner toast library (as included in tech stack) to display a success message like "Post published to LinkedIn and Twitter!"; if an error occurs (e.g. network issue or token expired), show an error toast; after publishing, you may redirect user to Recent Posts or update the UI to indicate success (e.g. clear the form or mark previews as published)

- **Task:** Test OAuth flows with real accounts
  - **Cursor Prompt:** (Manual) Verify the LinkedIn and Twitter OAuth flows end-to-end: connect a test LinkedIn account and Twitter account, then attempt a publish to ensure content appears on those platforms
  - **Human Notes:** Developer needs to use actual LinkedIn/Twitter test credentials and check the posts on those platforms; adjust scopes or API usage if any errors (e.g. permission issues); ensure to comply with API posting formats (text length limits: 3000 chars LinkedIn, 280 chars Twitter) and handle errors (like too long content)

## Milestone 5: Templates & Content Management

- **Task:** Finalize Prisma schema for templates and content

  - **Cursor Prompt:** Update the Prisma schema and migrate if needed: ensure the Templates table has fields for name and prompt text, and the Posts table has fields for formatted content for each platform (or a JSON blob) and image URL
  - **Human Notes:** If formatted content is stored separately per platform, consider adding fields like `linkedinContent` and `twitterContent` to Posts; otherwise store a JSON or a separate table for post contents per platform; run `prisma migrate dev` if changes were made

- **Task:** Seed initial content templates

  - **Cursor Prompt:** Write a script or use Prisma seeding to insert default templates (e.g., "LinkedIn Professional Tone", "Twitter Casual Tone" with appropriate prompt structures) into the database
  - **Human Notes:** Only needs to run once in development; these will be displayed on the Templates page and used by the formatting logic; ensure this runs after migrations (could integrate into deployment or a seeding step)

- **Task:** Connect template selection to formatting

  - **Cursor Prompt:** In the New Post UI, add a dropdown (or radio buttons) to select a template before generating content. Pass the selected template’s identifier to the formatting API so the LLM uses the correct prompt
  - **Human Notes:** If multiple templates exist for LinkedIn/Twitter, allow user to pick (for MVP, there might be just one per platform, so this could be skipped or a placeholder); ensure the formatting API route can accept a template ID or name and use the corresponding prompt text

- **Task:** Save draft posts to database

  - **Cursor Prompt:** When a new post is generated (even before publishing), save it in the database as a draft: create a Post record with raw content, initial formatted content, image URL (if any), and status = "Draft"
  - **Human Notes:** This could be done when the user clicks "Generate Preview" or automatically after LLM returns content; use Prisma to create the record; ensure the user ID (from Clerk) is attached to the Post; prerequisites: user must be logged in, database connection working

- **Task:** Implement post update (editing) flow

  - **Cursor Prompt:** When a user edits an existing post and re-generates or changes content, update the Post record in the database with the new content and reset status if needed (e.g. back to draft if it was published and they want to republish)
  - **Human Notes:** Use the postId to update the correct record via Prisma; if the post was published and is being edited for a new publish, you might choose to create a new draft or simply allow editing and re-publishing (business decision); for MVP, editing a published post could either be disabled or treated as creating a new post version

- **Task:** Implement delete post functionality

  - **Cursor Prompt:** Add a delete button (trash icon) for each post in the Recent Posts list. On click, open a confirmation (use a Shadcn UI Dialog modal) and if confirmed, call an API route to delete the post from the database
  - **Human Notes:** Use Prisma to `delete` the post by ID in the API route; consider also deleting any image file from storage (if applicable); ensure the UI updates (e.g. remove the item from list without full refresh, perhaps using mutate if SWR or refetch posts list after deletion)

- **Task:** Display post details and status in Recent Posts

  - **Cursor Prompt:** Enhance the Recent Posts page items to show more info: e.g. icons or labels for each platform where the post was published, and maybe a preview snippet of the content
  - **Human Notes:** If storing platform-specific post IDs/URLs, you could show a clickable link to the live post (for verification); ensure the styling clearly indicates status (use color coding or tags); no new dependencies needed, just conditional rendering based on post data

- **Task:** Enhance template management (optional admin feature)
  - **Cursor Prompt:** (Optional) Allow adding or editing templates in the Templates page – provide a form to create a new template with name and prompt, saving it to DB, and reflect the new template in the list
  - **Human Notes:** This might be an admin-only feature (you could hide behind a role); for now, it’s optional if time permits. If implemented, ensure form validation (template prompt should include a placeholder for user input), and consider security (only authorized users can add templates)

## Milestone 6: Settings & Personalization

- **Task:** Finalize dark/light theme functionality

  - **Cursor Prompt:** Ensure the theme toggle actually applies styles globally: implement a context or use `next-themes` package to manage the HTML `class="dark"` and store preference (e.g. in localStorage or via Clerk user metadata)
  - **Human Notes:** Test UI in both dark and light modes thoroughly – adjust any colors that don’t look good in light mode (the design provides color scheme for both); no external API needed, but verify Tailwind’s dark mode classes are functioning as expected

- **Task:** Display and manage connected accounts in Settings

  - **Cursor Prompt:** On the Settings page, under "Connected Accounts", show the status of LinkedIn and Twitter integration: if connected, display the account name or a connected indicator and a "Disconnect" button; if not, show a "Connect" button
  - **Human Notes:** Use data from the SocialIntegrations table (join with User) to know if tokens exist for that user; disconnecting can simply delete the token entry in DB (and perhaps call LinkedIn/Twitter API to revoke token if available); user may need to revoke access on the platform side as well for full disconnect

- **Task:** Provide user profile info and logout in Settings

  - **Cursor Prompt:** Display the user's profile information (name, email) on the Settings page, perhaps with an avatar. Include a logout button for convenience (in addition to the sidebar profile menu) using Clerk’s signOut
  - **Human Notes:** Clerk makes user info available via useUser hook; ensure sensitive info is not exposed beyond what's needed; no special dependencies – reuse Clerk data

- **Task:** Implement accessibility settings (text size adjustment)

  - **Cursor Prompt:** Add an accessibility section in Settings with an option to adjust text size (e.g. a toggle or slider for small/default/large text). When changed, apply a CSS class or style that increases base font size for content areas
  - **Human Notes:** This can be done by adjusting a root font-size or adding a Tailwind utility class throughout; store the preference in context or localStorage; ensure previews respond to this (they might just inherit global font sizing if done right)

- **Task:** Personalize content experience (future enhancements)
  - **Cursor Prompt:** (Future consideration) Include placeholder for notification settings or other personalization (e.g. email notifications when a post is successful, option to change accent color)
  - **Human Notes:** Not a current requirement, but keep the Settings page extensible; no immediate coding needed, but design the settings list in a way that new options can be added easily

## Milestone 7: Final Polish – Analytics, Testing, Accessibility, Deployment

- **Task:** Integrate PostHog analytics

  - **Cursor Prompt:** Install PostHog JS (`npm install posthog-js`) and initialize it in the app (e.g. in \_app.js or layout) with the project API key. Set up event tracking for key user actions such as content generation, publish, and theme toggle
  - **Human Notes:** Requires PostHog Project API Key (and Host URL if self-hosted) – add to env; ensure no personally identifiable information is sent unintentionally; test that events show up in the PostHog dashboard

- **Task:** Add event tracking for user actions

  - **Cursor Prompt:** After integrating PostHog, insert `posthog.capture('<event_name>', { /* props */ })` calls in relevant places: e.g., when a user generates content (`event: "generate_preview"`), when a post is published (`"publish_post"`), and when a template is selected or theme toggled
  - **Human Notes:** Define a consistent naming scheme for events; include useful properties (like platform published to, template used, etc.); verify events during testing to fine-tune what to track for product insights

- **Task:** Conduct cross-browser and device testing

  - **Cursor Prompt:** (Manual) Test the web app on multiple browsers (Chrome, Firefox, Safari) and devices (desktop and mobile) to catch any layout issues or bugs
  - **Human Notes:** Pay special attention to the responsive behavior of the sidebar and previews on mobile; check OAuth pop-ups on mobile browsers; fix any CSS issues (e.g. flex not wrapping, overflow problems) discovered during testing

- **Task:** Perform accessibility audit

  - **Cursor Prompt:** Use tools like Lighthouse or axe to audit accessibility. Fix issues: add alt text for images (the uploaded content image), aria-labels for icon buttons (collapse sidebar, logout, etc.), and ensure focus order is logical and visible
  - **Human Notes:** Ensure color contrast meets WCAG guidelines in both themes (adjust colors if needed, e.g. the accent orange/yellow against light background); test keyboard navigation (tab through inputs and buttons, open sidebar via keyboard, etc.); ensure screen reader announces important elements (use ARIA roles for toast notifications or live regions for success messages)

- **Task:** Write unit and integration tests

  - **Cursor Prompt:** Implement unit tests for critical utilities (e.g., a function to call the LLM API, ensuring prompt format is correct) and integration tests for pages (e.g., using Jest + React Testing Library to render the New Post page and simulate input and preview generation)
  - **Human Notes:** Set up Jest configuration for Next.js (if not already); possibly use Cypress or Playwright for an end-to-end test: log in a test user, create a draft, and simulate a publish (mock the external API calls); human intervention to run tests and interpret results

- **Task:** Optimize performance and loading

  - **Cursor Prompt:** Optimize Next.js performance: use dynamic `import()` for large modules if any (like if OpenAI SDK is heavy), enable image optimization for uploaded images (use Next `<Image>`), and ensure unnecessary re-renders are minimized in preview components
  - **Human Notes:** Analyze Lighthouse performance scores; consider adding a loading skeleton for the preview area while LLM is processing; ensure that external calls (LLM, OAuth) are only done when needed (avoid calling formatting API on every keystroke without debounce)

- **Task:** Deploy application to Vercel (production)

  - **Cursor Prompt:** Set up Vercel deployment by connecting the GitHub repo. Configure environment variables in Vercel for all keys (Clerk, Supabase, OpenAI, LinkedIn, Twitter, PostHog). Trigger a production build and deploy
  - **Human Notes:** After deployment, test the live app’s functionality (especially OAuth callbacks, which must match the production URL); monitor logs for any runtime errors (e.g. issues with Node version or API routes)

- **Task:** Prepare documentation and handoff materials

  - **Cursor Prompt:** Create or update the README.md with instructions on running the app, environment setup, and a summary of architecture. Also document any env variables and how to obtain them (without including secrets)
  - **Human Notes:** Include in documentation: how to run migrations, how to seed templates, how to start the dev server, and deployment instructions; also write a short user guide (optional) for app users explaining how to use Persona AI’s features

- **Task:** Final review and project closure
  - **Cursor Prompt:** (Manual) Do a final run-through of all user stories to ensure each is satisfied: inputting text and image, generating formatted previews, editing content, publishing to both platforms, and managing content in dashboard
  - **Human Notes:** If any requirement is unmet or any bug is found, log it and address it before marking the project complete; once everything is verified, the Persona AI web app is ready for launch and team sign-off
