import React from 'react';
import { Box, Text, Button } from "@skynexui/components";

const Servers = () => {
return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Quem é voce?</Text>
        {/* <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        /> */}
      </Box>
    </>
  );
}


export default Servers;
