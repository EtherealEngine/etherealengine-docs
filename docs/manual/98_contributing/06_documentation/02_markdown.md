import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Markdown Standard
This page will explain how to format your content to fit the standard used by this website.  

:::important
Ethereal Engine documentation uses a **very restricted** set of GitHub Markdown for formatting its content.  
Multitude of otherwise perfectly legal markdown rules are strictly forbidden by this standard.  

Please make sure to pay extra attention to these rules if you are already accustomed to markdown syntax.
:::

## The Markdown Problem
Markdown is a really powerful and easy to use alternative to html.  
It has a very intuitive and easy to understand syntax that can also give format to text in a similar level to how html can.  

One of its key features is how **flexible** it is.  
But, at the same time, this flexibility is also its biggest problem.  

Maintaining a cohesive format across a team with different users/writers that all have their own unique quirks and style for writing markdown, and all contribute to a project of the size of Ethereal Engine's Documentation _(this website)_, is extremely challenging without having a single and unified standard.

## The solution
Compressing the wide range of styling and formatting options that Markdown offers, down into a very minimal and simplified ruleset, pretty much solves the problem altogether.  

As such, this standard aims to be as minimal, simple and intuitive to use as possible.  

Markdown itself is very simple, but this standard simplifies it even further.  
Every syntax rule will allow for **only one** single and unified way of using it.  

:::note
This ruleset aims to achieve a clean and cohesive codebase that won't look internally messy, and/or have to be refactored to fit the website's quality standard every time a different contributor pushes new content into the site.  

It might feel very limiting and restricting if you already have developed your own workflow or quirks on how to write markdown syntax. But please remember how important it is to have a cohesive ruleset when working on a project of the size of this website.
:::


## Rules
This website uses a very restricted and minimal subset of GitHub Markdown ([GFM](https://github.github.com/gfm/)).  
Writing markdown with the standard explaned in this article will feel a lot stricter than usual.  
Because of this, every rule will have a tab listing the _(otherwise legal)_ syntax alternatives that GFM permits but we don't use.  



<br></br>
### `<` Syntax "Gotcha"
Every `<` character **MUST** be escaped _(like `\<`)_.  
Reason: Docusaurus interprets `.md` files as [MDX](https://mdxjs.com/docs/what-is-mdx).  
This means that all instances of `<Something>` will be interpreted as a JSX/TSX component.
:::danger
Not respecting this rule will make Docusaurus completely fail at compiling the website.  
This is the most likely cause of CI errors when pushing your content for the first time.
:::



<br></br>
### Notes and Highlights
Use admonitions for giving side notes, tips and/or warning the user about things that could cause problems for them.  
Here is the complete list of [Admonition types](https://docusaurus.io/docs/markdown-features/admonitions) and how to use them.
<Tabs>
<TabItem value="correct-admonition" label="Correct">

:::note
This note contains side information that is useful for the user, but shouldn't distract them from the main body of content.
:::
:::important
This block contains information of high importance that the user **should** pay attention to.
:::
:::tip
This block contains information that the user COULD be informed about, as it **might** make their life easier when followed.  
:::
:::warning
This block contains information that the user SHOULD be warned about, as it **might** create problems for them.  
:::
:::danger
This block contains information that the user MUST be warned about, as it **will** create problems for them when ignored.  
:::

**Custom Admonitions**:
<Tabs>
<TabItem value="custom-admonition-html" label="Rendered">
:::note[Admonitions can have custom titles and even [Links](https://www.etheralengine.com)]
Remember that admonitions can have custom titles that accept markdown syntax as usual.  
Don't overuse this feature, but remember that it can be very helpful depending on the situation.
:::
</TabItem>
<TabItem value="custom-admonition-md" label="Markdown">
```md
:::note[Admonitions can have custom titles and even [Links](https://www.etheralengine.com)]
Remember that admonitions can have custom titles that accept markdown syntax as usual.  
Don't overuse this feature, but remember that it can be very helpful depending on the situation.
:::
```
</TabItem>
</Tabs>

</TabItem>
<TabItem value="incorrect-admonition" label="Valid but Not-Allowed">

**Note**:
```md
> ```Note:``` This note contains side information that is useful for the user, but that shouldn't distract them from the main body of the content.  
```
> ```Note:``` This note contains side information that is useful for the user, but that shouldn't distract them from the main body of the content.  

**Important**:
```md
> ```Important:``` This block contains information of high importance that the user **should** pay attention to.  
```
> ```Important:``` This block contains information of high importance that the user **should** pay attention to.  

**Tip**:
```md
> ```Tip:``` This block contains information that the user COULD be informed about, as it **might** make their life easier when followed.
```
> ```Tip:``` This block contains information that the user COULD be informed about, as it **might** make their life easier when followed.  

**Warning**:
```md
> ```Warning:``` This block contains information that the user SHOULD be warned about, as it **might** create problems for them.  
```
> ```Warning:``` This block contains information that the user SHOULD be warned about, as it **might** create problems for them.  

**Danger**:
```md
> ```Danger:``` This block contains information that the user MUST be warned about, as it **will** create problems for them when ignored.  
```
> ```Danger:``` This block contains information that the user MUST be warned about, as it **will** create problems for them when ignored.  

</TabItem>
</Tabs>



<br></br>
### Titles
#### Usage of `#`
Pages must start their first title with `# Title`, not `## Title` or `### Title`.  
<details>
<summary>Reasoning:</summary>
<div>
- Markdown `#` becomes html `<h1>`
- The `#` title will be used for:
  - Page title
  - Sidebar label
  - The `sitemap.xml` file for use by website crawlers.  
    This is critical for SEO. Please make sure to use short titles that explain the content well.  
</div>
</details>

<Tabs>
<TabItem value="correct-titles" label="Correct">
```md
# Title1
## Title2
### Title3
#### Title4
##### Title5
###### Title6
```
</TabItem>
<TabItem value="incorrect-titles" label="Valid but Not-Allowed">

```md
Title1
======

Title2
------
```

</TabItem>
</Tabs>

:::note
Our configuration stops listing sub-sections in its Table of Contents sidebar at `<h5>`.
:::


#### Title-Content separation
Align the first line of a section right up next to its title.  
Separating sections with two empty lines between them is preferrable.  
<details>
<summary>Reasoning:</summary>
<div>
Having the first line of content of a section separate from their title is perfectly legal markdown to and turns into readable html. But it makes the page a bit less clean and readable in markdown format.
</div>
</details>
<Tabs>
<TabItem value="correct-titles-sep" label="Correct">

```md
# Title1
Each section's first line must be close to its title.  

Second line of this section.


## Title2
This line is also close to its title.  
We also separated the sections with two empty lines, which is not mandatory but useful.
```

</TabItem>
<TabItem value="incorrect-bulletp" label="Valid but Not-Allowed">

```md
# Title1

This section's first line has a space separating the line from its title.

Second line of this section.

## Title2

This line is also not close to its title.

Too many line separations make the page less readable in markdown format.
```
</TabItem>
</Tabs>



<br></br>
### Paragraph separation
End lines with double space `  ` for newline breaks within the same paragraph.
<details>
<summary>Reasoning:</summary>
<div>
Paragraphs and sentences get bunched together into very unreable blocks of text when not using `  ` at the end of lines.
:::note
_End-of-line `  ` converts into html `<br>`_
:::
</div>
</details>

<Tabs>
<TabItem value="correct-spacing" label="Correct">
This is a line ending with `  `.  
This second line will be aligned to the bottom of the previous one.

This is a line in another paragraph, separated from the other lines by leaving an empty line in between.
</TabItem>
<TabItem value="incorrect-spacing" label="Valid but Not-Allowed">
This is a line that does not end with `  `.
This second line will be appended to the previous one, without any `<br>` line breaks between them.

This line is separate from the other lines. It is not affected by the `  ` rule.
</TabItem>
<TabItem value="dramatic-spacing" label="Dramatic Example">
<Tabs>
<TabItem value="dramatic-spacing-html" label="Rendered">
All.
of.
these.
words.
are.
written.
in.
separate.
lines.

This is a clear and simple sentence.
This is another sentence that is also clear and simple.
This third sentence is also clear, simple, and should also be a separate line.
This fourth sentence already becomes really hard to conceptually separate from the others, just because line breaks were not used.
By this sentence, if the concepts were important to remember, you are already struggling to pay attention to this block of text and remember each individual concept, even if each sentence was clear, simple and easy to read individually.
All of the sentences in this block of code were written in separate lines without using `  ` at the end of each.
</TabItem>
<TabItem value="dramatic-spacing-md" label="Markdown">
```md
All.
of.
these.
words.
are.
written.
in.
separate.
lines.
```
```md
This is a clear and simple sentence.
This is another sentence that is also clear and simple.
This third sentence is also clear, simple, and should also be a separate line.
This fourth sentence already becomes really hard to conceptually separate from the others, just because line breaks were not used.
By this sentence, if the concepts were important to remember, you are already struggling to pay attention to this block of text and remember each individual concept, even if each sentence was clear, simple and easy to read individually.
All of the sentences in this block of code were written in separate lines without using `  ` at the end of each.
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>



<br></br>
### Text Formatting
<Tabs>
<TabItem value="correct-text-format" label="Correct">
- Asterisk `**` for **bold** text.
- Underscore `_` for _italic_ text.
- Tilde `~~` for ~~strikethrough~~ text.
</TabItem>
<TabItem value="incorrect-text-format" label="Valid but Not-Allowed">
- Double `__` underscore for __bold__ text is not allowed.
- Single `*` asterisk for *italic* text is not allowed. Single `*` is not used for anything.
- Single `~` tilde for ~strikethrough text~ is not allowed.  
  Some markdown styles allow it, others dont. Double `~~` is the most commonly used version.
```md
- Double `__` underscore for __bold__ text is not allowed.
- Single `*` asterisk for *italic* text is not allowed. Single `*` is not used for anything.
- Single `~` tilde for ~strikethrough text~ is not allowed.  
```
</TabItem>
</Tabs>

<details>
<summary>Reasoning:</summary>
<div>
For clarity and simplicity, these caracters are reserved exclusively for one single purpose:  
- Character `*` reserved for bold text, even if it *could* be used for *italic text*.
- Character `_` reserved for italic text, even if it _could_ be used for __bold text__.
- Double `~~` is the most commonly used syntax for strikethrough text. Some markdown styles allow it, others dont.
</div>
</details>



<br></br>
### Bullet Points
<Tabs>
<TabItem value="correct-bulletp" label="Correct">
- Bullet points must use `-`  
- Numbered bullet points must use `N.`  
- **Bullet point titles**: Formatted as `- **Title**: Some text`  
- Multi-line bullet points are allowed  
  _(an preferred for clarity when they make sense)_  
  They must be aligned to the character above to work like this example.
</TabItem>
<TabItem value="incorrect-bulletp" label="Valid but Not-Allowed">
* This is a bullet point created with `*`.
1) This is a numbered bullet point created with `1)`.
- **This is:** A titled bullet point, that has the `:` inside **bold**.
```md
* This is a bullet point created with `*`.
1) This is a numbered bullet point created with `1)`.
- **This is:** A titled bullet point, that has the `:` inside **bold**.
```
</TabItem>
</Tabs>

<details>
<summary>Reasoning:</summary>
<div>
- Double `*` is reserved for bolds, and single `*` is disallowed for simplicity.
- Numbered bullet points get converted into `N.` when rendered as `<p>` in html.  
  Makes more sense to already format them that way with markdown syntax.
- **Bold Titles**: formatted with `:` outside bold is a small adjustment with apparently little gain.  
  Its goal is to make titles a bit cleaner and more readable in both markdown and rendered html.
</div>
</details>



<br></br>
### Code: Blocks {#codeblock}
- Code blocks must always define a language, even if that language is just \`\`\`text.  
- Code blocks for programming languages must always add the `showLineNumbers` directive on their title.
- Code blocks should define a `title="/path/to/file.ext"` if possible.
<Tabs>
<TabItem value="correct-codeblock" label="Correct">
```ts title="/path/to/SomeCodeFile.ts" showLineNumbers
// This codeblock defines a title, so it gets a label.
// It defines the `showLineNumbers` directive, so its lines are numbered.
// It also gets syntax highlighting because it was marked with ```ts

/**
 * @description This is a documentation comment.
 * @note JSdoc/TSdoc tags are also syntax hightlighted.
 */
function someFunction(arg1 :Type1, arg2 :Type2) :void {
  const one :string= 'This is a thing'
  return;
}
```
</TabItem>
<TabItem value="incorrect-codeblock" label="Valid but Not-Allowed">

```
// This codeblock does not define a title, so it doesn't get a label.
// It does not define the `showLineNumbers` directive, so lines are not numbered.
// It also gets no highlighting because it didn't define a language

/**
 * @description This is a documentation comment.
 * @note JSdoc/TSdoc tags are also syntax hightlighted.
 */
function someFunction(arg1 :Type1, arg2 :Type2) :void {
  const one :string= 'This is a thing'
  return;
}
```
</TabItem>
</Tabs>

<details>
<summary>Reasoning:</summary>
<div>
Single and simple rule: Always add a language to any block of code.  
- Syntax highlighting makes code a lot easier to read.  
- Giving a language, even when its just `text`, makes the writing workflow more consistent across the entire codebase.  

Giving a title and adding line numbers to codeblocks makes their presentation look a lot better and easier to understand and/or reference.
</div>
</details>


<br></br>
### Code: Inline
- Inline code should be avoided as much as possible.  
  A proper syntax-highlighed codeblock should be used instead.  
  Only use inline code for highlighting text with a monospaced font.  

- Inline code syntax must use single \` characters.  
  _Example_: \`this-is-code\` turns into `this-is-code`  

- Triple \`\`\` inline syntax is not allowed.

<details>
<summary>Reasoning:</summary>
<div>
- Proper \`\`\`bash codeblocks, as those mentioned in the [previous section](#codeblock), are much more readable and clear.  
- The syntax \`\`\`some bash command\`\`\` is unnecessarily complex for achieving the exact same result as single \` characters does.  
- Triple \`\`\` syntax is strictly reserved for codeblocks.
</div>
</details>



<br></br>
### #todo lists
<Tabs>
<TabItem value="todo-html" label="Rendered">
- [ ] Task 1
  - [x] Task 1.1
  - [ ] Task 1.2
- [ ] Task 2
</TabItem>
<TabItem value="todo-md" label="Markdown">
```md
- [ ] Task 1
  - [x] Task 1.1
  - [ ] Task 1.2
- [ ] Task 2
```
</TabItem>
</Tabs>
<details>
<summary>Reasoning:</summary>
<div>
The character `-` is also used for bullet point, which conflicts with this rule.  
But there is no alternative syntax to create TODO tasklists with markdown.

:::note[rule overlap]
`*` could be changed for use in bullet points, which would free `-` to be used just for todo lists.  
But `*` is reserved for bold with `**` for simplicity, since bold text is used a lot more often.  
That leaves us with this overlap of `-` being used for todo-lists and also for bullet point entries.
:::
</div>
</details>

