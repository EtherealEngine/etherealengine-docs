import React from 'react';

const DetailsCSS = "details_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module isBrowser_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module alert alert--info details_node_modules-@docusaurus-theme-classic-lib-theme-Details-styles-module "

export const TechnicalNote = (props) => {
  const TextTitle = props.title ? props.title : "Technical Note"
  const Note      = "alert alert--secondary mb-5 bg-neutral-900"
  //const Note      = DetailsCSS + "mb-5 bg-neutral-900"
  const Title     = "text-blue-200 hover:cursor-pointer"
  const Body      = "pt-4"
  return (<React.Fragment>
    <details className={Note}>
      <summary className={Title}>{TextTitle}</summary>
      <div className={Body}>{props.children}</div>
    </details>
  </React.Fragment>);
};

