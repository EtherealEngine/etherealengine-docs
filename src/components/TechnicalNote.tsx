import React from 'react';

export const TechnicalNote = (props) => {
  const TextTitle = props.title ? props.title : "Technical Note"
  const Note      = "alert alert--secondary mb-5 bg-neutral-900"
  const Title     = "text-blue-200"
  const Body      = "pt-4"
  return (<React.Fragment>
    <details className={Note}>
      <summary className={Title}>{TextTitle}</summary>
      <div className={Body}>{props.children}</div>
    </details>
  </React.Fragment>);
};

