import { Button, Flex, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';


// Hay varias maneras de exportar/importar modulos:
// Explicación muy clara: https://javascript.info/import-export#summary
export const Header = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="space-between" alignItems="center">
            <Text>Voting</Text>
            <ConnectButton />
        </Flex>
    )
};