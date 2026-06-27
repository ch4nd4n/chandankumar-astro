---
title: "Gatsby Theme Shadowing Lekoarts"
date: 2021-12-06
tags:
  - gatsby
---
This site is powered by Lekoarts theme, while it has a lot of features, I wanted
to change styling and some text contents that the theme defaults to.

To this I figured I have to change the Home layout in Lekoart.
I copied `homepage.tsx` from `node_modules/@lekoarts/gatsby-theme-minimal-blog/src/components/` to
project `src` folder.

Gatsby official documentation does cite how to do this, but the chances are that one might
miss it out. Following is what the Gatsby documentation says about shadowing

> Gatsby themes introduce a concept called “shadowing”. This feature allows users to
> replace a file in the src directory that is included in the webpack bundle with their
> own implementation. This works for React components, pages in src/pages, JSON files,
> TypeScript files, as well as any other imported file (such as .css) in your site.
>
> https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/

### Lekoarts Gatsby theme shadowing

After copying the file from node_modules to apt src folder, the references needs to be updated
for example to something below

```tsx:title=homepage.tsx
```

Refer to https://github.com/ch4nd4n/chandankumar.com/blob/45e8fcb2625023d2683d6d9c9464411b774ba700/src/%40lekoarts/gatsby-theme-minimal-blog/components/homepage.tsx

Effective path for this file is `/src/@lekoarts/gatsby-theme-minimal-blog/components/homepage.tsx`

To change the footer of this site, I did something like

```tsx:title=footer.tsx
/** @jsx jsx */

const Footer = () => {
  const { siteTitle } = useSiteMetadata();

  return (
    <footer
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `space-between`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
        variant: `dividers.top`,
      }}
    >
      <div>
        <span
          sx={{ width: "10px", display: "inline-block", marginRight: "2px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 980">
            <circle
              cx="490"
              cy="490"
              r="440"
              fill="none"
              stroke="#000"
              strokeWidth="100"
            />
            <path d="M219,428H350a150,150 0 1 1 0,125H219a275,275 0 1 0 0-125z" />
          </svg>
        </span>
        Copyleft. WTH
      </div>
      <div>
        Theme
        {` `}
        by
        {` `}
        LekoArts
      </div>
    </footer>
  );
};

export default Footer;
```
