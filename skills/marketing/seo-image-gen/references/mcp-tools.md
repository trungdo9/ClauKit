# MCP Tools Reference: @ycse/nanobanana-mcp

> This is one example image-generation MCP, documented here because it's the backend the source project was built against. ClauKit does not vendor or require this specific package — check what's actually connected in the current session before assuming these tool names exist. If a different image-gen MCP is connected, look up its equivalent tools instead; the SEO use-case mapping in `SKILL.md` doesn't change.
>
> Package: `@ycse/nanobanana-mcp`
> GitHub: https://github.com/YCSE/nanobanana-mcp

## Tools

### gemini_generate_image
Generate an image from a text prompt.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to generate |

**Returns:** Image data + file path (saved to `~/Documents/nanobanana_generated/`)

**Example usage in Claude Code:**
```
User: "Generate a sunset over mountains in watercolor style"
→ Claude calls gemini_generate_image with prompt
→ Returns image path and description
```

### gemini_edit_image
Edit an existing image with text instructions.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `imagePath` | string | Yes | Path to the image file to edit |
| `prompt` | string | Yes | Edit instructions |

**Returns:** Modified image data + file path

**Example:**
```
User: "Remove the background from ~/Documents/photo.png"
→ Claude calls gemini_edit_image with path and instruction
```

### gemini_chat
Multi-turn visual conversation maintaining session context.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | Chat message (can reference previous images) |

**Returns:** Text response + optional image

**Key feature:** Session consistency, which maintains style, characters, and context across turns. Great for iterative refinement.

### set_aspect_ratio
Configure the aspect ratio for subsequent image generations.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `ratio` | string | Yes | Aspect ratio (e.g., "16:9", "1:1", "9:16") |

**Supported ratios:** 1:1, 16:9, 9:16, 4:3, 3:4, 2:3, 3:2, 4:5, 5:4, 1:4, 4:1, 1:8, 8:1, 21:9

### set_model
Switch the active Gemini model.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model identifier |

**Package model aliases — verify against the installed package and Google's model docs before use:**
- `gemini-3.1-flash-image-preview` (package default alias, unverified as a Google-confirmed model name)
- `gemini-2.5-flash-image` (package fallback alias, verify before use)

### get_image_history
Retrieve list of images generated in the current session.

**Parameters:** None

**Returns:** Array of image entries with paths and prompts

### clear_conversation
Reset session context and conversation history.

**Parameters:** None

**Returns:** Confirmation of reset

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | Yes | API key from https://aistudio.google.com/apikey |
| `NANOBANANA_MODEL` | No | Override the default model from the installed package |

## Output Directory
By default, this package saves generated images to: `~/Documents/nanobanana_generated/`

Images are named with timestamps for easy identification. Adjust to wherever the current project keeps generated assets (e.g. under `plans/marketing/<campaign>/assets/`) once generated.

## Feature Availability via MCP

Some newer Gemini API features depend on the MCP package version. Check the package version to confirm support:

| Feature | API Status | MCP Support |
|---------|-----------|-------------|
| `imageSize` (resolution control) | Available | Depends on package version |
| Thinking level (`thinkingConfig`) | Available | Depends on package version |
| Search grounding (`googleSearch`) | Available | Depends on package version |
| Image-only output (`responseModalities: ["IMAGE"]`) | Available | Depends on package version |
| Multi-image input (up to 14 refs) | Available | Via `gemini_chat` with image paths |
| All 14 aspect ratios | Available | Via `set_aspect_ratio` |

If a feature is not yet supported by the connected MCP package, it may still be reachable via a direct API call with `curl` or the Google AI SDK, if credentials are available.
