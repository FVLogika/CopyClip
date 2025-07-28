# CopyClip - Invisible Copy jQuery Plugin

Version: 1.0.0  
Author: Flavio  
License: MIT  
Repository: https://github.com/FVLogika/CopyClip

## Description:

CopyClip is a lightweight and modular jQuery plugin that allows automatic copying of text
hidden inside a custom HTML tag (default: `<cc-text>`) to the clipboard when clicking trigger elements.
Automatic CSS injection and event delegation make it compatible with dynamically added elements
after initialization.

## Main Features:

- Automatic CSS rules injection to hide the tag and enable pointer cursor
- Delegation on document to support dynamic elements
- Compatible with modern Clipboard API and legacy fallback via execCommand
- Customizable callbacks for success and error handling

## Installation:

1. Include jQuery in your page
2. Include copyclip.js in your project
- use dowloaded copy or
- use CDN https://cdn.jsdelivr.net/gh/FVLogika/CopyClip/copyclip.min.js

## Basic Example:

HTML:
```html
<button class="copy">
  Secret code
  <cc-text>ABC123</cc-text>
</button>

<p>bla bla bla... <span class="copy">click here<cc-text>hidden text to copy</cc-text></span> ... bla bla</p>
```

JS:
```js
$(function(){
  $.fn.CopyClip({
    onCopy: function(text, el) {
      alert('Copied text: ' + text);
    },
    onError: function(err, el) {
      console.error('Copy error:', err);
    }
  });
});
```

## Compatibility:

- Any clickable element: <button>, <a>, <td>, <div>, etc.  
- Dynamically added content via Ajax or DOM  
- Modern browsers + fallback for legacy ones

## Available Options:

- selector: jQuery selector for trigger elements (default: '.copy')
- tag: Name of the custom HTML tag containing the text to copy (default: 'cc-text')
- onCopy: Callback function receiving the copied text and the clicked element
- onError: Callback function receiving the error and the clicked element

## Technical Notes:

- Uses navigator.clipboard.writeText when available.
- Falls back to hidden textarea + document.execCommand('copy') when not.
- The custom tag can be renamed or replaced by any other element.
- CSS rules are injected only if not already present in the document.

## Tips:

- Avoid interactive content inside <cc-text> to prevent conflicts.
- If you use external tooltips or alerts, manage them via the onCopy callback.
- For HTML safety, ensure your custom tag is valid within your framework.

## License:

MIT – free to use with attribution. See LICENSE in the repository.

## Author:

Flavio – Milan, Italy  
GitHub Repository: https://github.com/FVLogika/CopyClip
