import React from 'react';
import { Box, Text, Image, } from '@skynexui/components';

import loadingImg from "../images/pngegg.png";

function Loading() {
    return (
        <Box styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width:'50%',
            height: '90%',
            marginLeft:'110px',
            marginBottom: '4rem',
        }}>
            <Image src={loadingImg} styleSheet={{
                animation: 'rotate-center 2s linear infinite both'
            }} />
         
        </Box>
    );
}

export default Loading;