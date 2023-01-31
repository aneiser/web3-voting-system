import { Flex, Text } from '@chakra-ui/react'

// Hay varias maneras de exportar/importar modulos:
// Explicación muy clara: https://javascript.info/import-export#summary

export const Footer = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="center">
            <Text> Made by Adrián Neila Serrano &copy; in Paris {new Date().getFullYear()}</Text>
        </Flex>
    )
};