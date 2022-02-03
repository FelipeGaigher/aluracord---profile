import React from 'react';
import appConfig from "../../config.json";

function Title(props) {
  console.log(props);
  const Tag = props.tag;
  return (
    <>
      <Tag> {props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: {}
          
          color: ${appConfig.theme.colors.neutrals["100"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default Title;