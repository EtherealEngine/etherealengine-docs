import React from 'react';

export const UnstyledDetails = (props) => {
  const TextTitle = props.title
  const Note = "mb-5"
  const Title = "text-blue-200 hover:cursor-pointer"
  const Body = "pt-4"
  return (<React.Fragment>
    <details className={Note}>
      <summary className={Title}>{TextTitle}</summary>
      <div className={Body}>{props.children}</div>
    </details>
  </React.Fragment>);
};


