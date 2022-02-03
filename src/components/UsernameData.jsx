import React from "react";
import { Text } from "@skynexui/components";

import appConfig from "../../config.json";

function UsernameData({ children }) {
  return (
    <Text
      variant="body3"
      styleSheet={{
        color: appConfig.theme.colors.neutrals[300],
        marginTop: "4px",
      }}
    >
      {children}
    </Text>
  );
}

export default UsernameData;