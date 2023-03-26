# Sanity Co-Writer

## What it is?

Sanity Co-Writer is a ChatGPT-powered editorial assistant that is contextually aware of the document you are working on, ensuring it provides precise and relevant assistance. In this example, you will assume the role of a web editor for a food blog, and the assistant will cater its help accordingly.

## How do I use it?

This example have been built on the blog boilerplate template

1. Clone repository
2. Run `npm install`
3. Create an OpenAI account and copy an API-key from https://platform.openai.com/account/api-keys
4. Create a `.env.development` on root and add the required variables using the `.env.template` as a template
5. Insepect the `literalConstants.ts` and especially the const `ChatGPT_RoleInstructions` which sets the "persona" of the chat responder. For this example it assumes the role of a web editor assitant of a food blog
6. Run `Sanity dev`
7. Create and publish a (food related) blog post
8. Open `Co-writer` tab
9. Get creative and write good content!

## Work to be done

- [x] Add user profile image and name to the chat view
- [ ] Make Co-Writer a Sanity plugin, not a proof of concept project
- [ ] Open chat in a `Review Changes`-like pane and don't close document editor window
- [ ] Store chat dialog in Sanity for future reference
- [ ] Pass document relevant fields via options to the component
- [ ] Make it possible to override the persona/system role
  - [ ] In the conversation using the UI
  - [ ] Passed as an option, if possible pr. schema type
- [ ] Add `Copy to clipboard` functionallity
- [ ] Add copy to fields passed in options, i.e; `Copy to title`, `Copy to body`
- [ ] Don't render co-writer button (and view) on all schema types
- [x] Add `Send on [enter]` in chat input textbox
