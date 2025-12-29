# Quill Editor Installation

The email template feature uses Quill editor for rich text editing. To install the required dependencies, run:

```bash
npm install react-quill quill --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required because `react-quill` doesn't officially support React 19 yet, but it works fine with this flag.

After installation, the Quill editor will work properly in the create and edit template pages.
